import {
  ADVECTION_SHADER,
  BASE_VERTEX_SHADER,
  CLEAR_SHADER,
  CONFIG,
  COPY_SHADER,
  CURL_SHADER,
  DISPLAY_SHADER,
  DIVERGENCE_SHADER,
  GRADIENT_SUBTRACT_SHADER,
  PRESSURE_SHADER,
  SPLAT_SHADER,
  VORTICITY_SHADER,
} from "@/lib/fluid/shaders";
import {
  correctDeltaX,
  correctDeltaY,
  createDoubleFBO,
  createFBO,
  createProgram,
  getResolution,
  getWebGLContext,
  resizeDoubleFBO,
  scaleByPixelRatio,
  type DoubleFbo,
  type SingleFbo,
} from "@/lib/fluid/webgl";

export type DyeFluidController = {
  resize: () => void;
  dispose: () => void;
};

type PointerState = {
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  moved: boolean;
  color: { r: number; g: number; b: number };
};

function generateColor() {
  const hue = Math.random();
  const saturation = 0.55;
  const value = 1;
  const i = Math.floor(hue * 6);
  const f = hue * 6 - i;
  const p = value * (1 - saturation);
  const q = value * (1 - f * saturation);
  const t = value * (1 - (1 - f) * saturation);

  let r = 0;
  let g = 0;
  let b = 0;

  switch (i % 6) {
    case 0:
      r = value;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = value;
      b = p;
      break;
    case 2:
      r = p;
      g = value;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = value;
      break;
    case 4:
      r = t;
      g = p;
      b = value;
      break;
    default:
      r = value;
      g = p;
      b = q;
      break;
  }

  return {
    r: r * 0.9,
    g: g * 0.9,
    b: b * 0.9,
  };
}

function lerpRgb(
  a: PointerState["color"],
  b: PointerState["color"],
  t: number,
): PointerState["color"] {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function correctRadius(canvas: HTMLCanvasElement, radius: number) {
  const aspectRatio = canvas.width / canvas.height;
  return aspectRatio > 1 ? radius * aspectRatio : radius;
}

export function startDyeFluid(
  canvas: HTMLCanvasElement,
  requestedDyeResolution: number,
): DyeFluidController | null {
  const context = getWebGLContext(canvas);
  if (!context) {
    return null;
  }

  const { gl, ext } = context;
  const config = {
    ...CONFIG,
    DYE_RESOLUTION: requestedDyeResolution,
    SHADING: CONFIG.SHADING && ext.supportLinearFiltering,
  };

  const clearProgram = createProgram(gl, BASE_VERTEX_SHADER, CLEAR_SHADER);
  const splatProgram = createProgram(gl, BASE_VERTEX_SHADER, SPLAT_SHADER);
  const advectionProgram = createProgram(
    gl,
    BASE_VERTEX_SHADER,
    ADVECTION_SHADER,
    ext.supportLinearFiltering ? [] : ["MANUAL_FILTERING"],
  );
  const divergenceProgram = createProgram(gl, BASE_VERTEX_SHADER, DIVERGENCE_SHADER);
  const curlProgram = createProgram(gl, BASE_VERTEX_SHADER, CURL_SHADER);
  const vorticityProgram = createProgram(gl, BASE_VERTEX_SHADER, VORTICITY_SHADER);
  const pressureProgram = createProgram(gl, BASE_VERTEX_SHADER, PRESSURE_SHADER);
  const gradientSubtractProgram = createProgram(
    gl,
    BASE_VERTEX_SHADER,
    GRADIENT_SUBTRACT_SHADER,
  );
  const copyProgram = createProgram(gl, BASE_VERTEX_SHADER, COPY_SHADER);
  const displayProgram = createProgram(
    gl,
    BASE_VERTEX_SHADER,
    DISPLAY_SHADER,
    config.SHADING ? ["SHADING"] : [],
  );

  if (
    !clearProgram ||
    !splatProgram ||
    !advectionProgram ||
    !divergenceProgram ||
    !curlProgram ||
    !vorticityProgram ||
    !pressureProgram ||
    !gradientSubtractProgram ||
    !copyProgram ||
    !displayProgram
  ) {
    return null;
  }

  const quadBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  if (!quadBuffer || !indexBuffer) {
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

  const bindFullscreenGeometry = (program: ReturnType<typeof createProgram>) => {
    if (!program) {
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.enableVertexAttribArray(program.positionLocation);
    gl.vertexAttribPointer(program.positionLocation, 2, gl.FLOAT, false, 0, 0);
  };

  const blit = (target: SingleFbo | null, clear = false) => {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    if (clear) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  let dye: DoubleFbo | null = null;
  let velocity: DoubleFbo | null = null;
  let divergence: SingleFbo | null = null;
  let curl: SingleFbo | null = null;
  let pressure: DoubleFbo | null = null;

  const initFramebuffers = () => {
    const simRes = getResolution(gl, config.SIM_RESOLUTION);
    const dyeRes = getResolution(gl, config.DYE_RESOLUTION);
    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA;
    const rg = ext.formatRG;
    const r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.disable(gl.BLEND);

    if (!dye) {
      dye = createDoubleFBO(
        gl,
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      );
    } else {
      dye = resizeDoubleFBO(
        gl,
        dye,
        copyProgram,
        bindFullscreenGeometry,
        blit,
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      );
    }

    if (!velocity) {
      velocity = createDoubleFBO(
        gl,
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering,
      );
    } else {
      velocity = resizeDoubleFBO(
        gl,
        velocity,
        copyProgram,
        bindFullscreenGeometry,
        blit,
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering,
      );
    }

    if (divergence) {
      gl.deleteTexture(divergence.texture);
      gl.deleteFramebuffer(divergence.fbo);
    }
    if (curl) {
      gl.deleteTexture(curl.texture);
      gl.deleteFramebuffer(curl.fbo);
    }
    if (pressure) {
      gl.deleteTexture(pressure.read.texture);
      gl.deleteFramebuffer(pressure.read.fbo);
      gl.deleteTexture(pressure.write.texture);
      gl.deleteFramebuffer(pressure.write.fbo);
    }

    divergence = createFBO(
      gl,
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    );
    curl = createFBO(
      gl,
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    );
    pressure = createDoubleFBO(
      gl,
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    );
  };

  const resizeCanvas = () => {
    const width = scaleByPixelRatio(canvas.clientWidth || window.innerWidth);
    const height = scaleByPixelRatio(canvas.clientHeight || window.innerHeight);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  };

  initFramebuffers();
  resizeCanvas();

  const getBuffers = () => {
    if (!dye || !velocity || !divergence || !curl || !pressure) {
      throw new Error("Fluid buffers are not initialized");
    }

    return { dye, velocity, divergence, curl, pressure };
  };

  let colorFrom = generateColor();
  let colorTo = generateColor();

  const pointer: PointerState = {
    texcoordX: 0.5,
    texcoordY: 0.5,
    prevTexcoordX: 0.5,
    prevTexcoordY: 0.5,
    deltaX: 0,
    deltaY: 0,
    moved: false,
    color: lerpRgb(colorFrom, colorTo, 0),
  };

  let colorUpdateTimer = 0;
  let lastUpdateTime = performance.now();
  let raf = 0;

  /** Avoid a velocity streak from the default center (0.5, 0.5) to the first real pointer sample. */
  let pointerSynced = false;

  const updatePointerMoveData = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    const posX = scaleByPixelRatio(clientX - rect.left);
    const posY = scaleByPixelRatio(clientY - rect.top);
    const nextX = Math.min(Math.max(posX / canvas.width, 0), 1);
    const nextY = 1 - Math.min(Math.max(posY / canvas.height, 0), 1);

    if (!pointerSynced) {
      pointer.texcoordX = nextX;
      pointer.texcoordY = nextY;
      pointer.prevTexcoordX = nextX;
      pointer.prevTexcoordY = nextY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.moved = false;
      pointerSynced = true;
      return;
    }

    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = nextX;
    pointer.texcoordY = nextY;
    pointer.deltaX = correctDeltaX(canvas, pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(canvas, pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
  };

  const splat = (x: number, y: number, dx: number, dy: number, color: PointerState["color"]) => {
    const buffers = getBuffers();

    gl.useProgram(splatProgram.program);
    bindFullscreenGeometry(splatProgram);

    gl.uniform1i(splatProgram.uniforms.uTarget, buffers.velocity.read.attach(0));
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
    gl.uniform1f(splatProgram.uniforms.radius, correctRadius(canvas, config.SPLAT_RADIUS / 100));
    blit(buffers.velocity.write);
    buffers.velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, buffers.dye.read.attach(0));
    gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(buffers.dye.write);
    buffers.dye.swap();
  };

  const SPLAT_SUBSTEP_MAX = 12;

  const splatPointer = () => {
    const px = pointer.prevTexcoordX;
    const py = pointer.prevTexcoordY;
    const cx = pointer.texcoordX;
    const cy = pointer.texcoordY;
    const du = cx - px;
    const dv = cy - py;
    const dist = Math.hypot(du, dv);
    const substeps = Math.min(
      SPLAT_SUBSTEP_MAX,
      Math.max(1, Math.ceil(dist * 80)),
    );
    const fx = (pointer.deltaX * config.SPLAT_FORCE) / substeps;
    const fy = (pointer.deltaY * config.SPLAT_FORCE) / substeps;
    for (let i = 0; i < substeps; i += 1) {
      const t = (i + 0.5) / substeps;
      splat(px + du * t, py + dv * t, fx, fy, pointer.color);
    }
  };

  const seedScene = () => {
    const seeds = [
      { x: 0.22, y: 0.58, dx: 180, dy: -40, color: { r: 0.88, g: 0.48, b: 0.96 } },
      { x: 0.5, y: 0.5, dx: 0, dy: 0, color: { r: 0.56, g: 0.9, b: 0.72 } },
      { x: 0.78, y: 0.58, dx: -180, dy: 40, color: { r: 0.55, g: 0.82, b: 1.0 } },
    ];

    for (const seed of seeds) {
      splat(seed.x, seed.y, seed.dx, seed.dy, seed.color);
    }
  };

  const applyInputs = () => {
    if (pointer.moved) {
      pointer.moved = false;
      splatPointer();
    }
  };

  const step = (dt: number) => {
    const buffers = getBuffers();

    gl.disable(gl.BLEND);

    gl.useProgram(curlProgram.program);
    bindFullscreenGeometry(curlProgram);
    gl.uniform2f(
      curlProgram.uniforms.texelSize,
      buffers.velocity.texelSizeX,
      buffers.velocity.texelSizeY,
    );
    gl.uniform1i(curlProgram.uniforms.uVelocity, buffers.velocity.read.attach(0));
    blit(buffers.curl);

    gl.useProgram(vorticityProgram.program);
    bindFullscreenGeometry(vorticityProgram);
    gl.uniform2f(
      vorticityProgram.uniforms.texelSize,
      buffers.velocity.texelSizeX,
      buffers.velocity.texelSizeY,
    );
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, buffers.velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, buffers.curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(buffers.velocity.write);
    buffers.velocity.swap();

    gl.useProgram(divergenceProgram.program);
    bindFullscreenGeometry(divergenceProgram);
    gl.uniform2f(
      divergenceProgram.uniforms.texelSize,
      buffers.velocity.texelSizeX,
      buffers.velocity.texelSizeY,
    );
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, buffers.velocity.read.attach(0));
    blit(buffers.divergence);

    gl.useProgram(clearProgram.program);
    bindFullscreenGeometry(clearProgram);
    gl.uniform1i(clearProgram.uniforms.uTexture, buffers.pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(buffers.pressure.write);
    buffers.pressure.swap();

    gl.useProgram(pressureProgram.program);
    bindFullscreenGeometry(pressureProgram);
    gl.uniform2f(
      pressureProgram.uniforms.texelSize,
      buffers.velocity.texelSizeX,
      buffers.velocity.texelSizeY,
    );
    gl.uniform1i(pressureProgram.uniforms.uDivergence, buffers.divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i += 1) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, buffers.pressure.read.attach(1));
      blit(buffers.pressure.write);
      buffers.pressure.swap();
    }

    gl.useProgram(gradientSubtractProgram.program);
    bindFullscreenGeometry(gradientSubtractProgram);
    gl.uniform2f(
      gradientSubtractProgram.uniforms.texelSize,
      buffers.velocity.texelSizeX,
      buffers.velocity.texelSizeY,
    );
    gl.uniform1i(
      gradientSubtractProgram.uniforms.uPressure,
      buffers.pressure.read.attach(0),
    );
    gl.uniform1i(
      gradientSubtractProgram.uniforms.uVelocity,
      buffers.velocity.read.attach(1),
    );
    blit(buffers.velocity.write);
    buffers.velocity.swap();

    gl.useProgram(advectionProgram.program);
    bindFullscreenGeometry(advectionProgram);
    gl.uniform2f(
      advectionProgram.uniforms.texelSize,
      buffers.velocity.texelSizeX,
      buffers.velocity.texelSizeY,
    );
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(
        advectionProgram.uniforms.dyeTexelSize,
        buffers.velocity.texelSizeX,
        buffers.velocity.texelSizeY,
      );
    }

    const velocityId = buffers.velocity.read.attach(0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(buffers.velocity.write);
    buffers.velocity.swap();

    if (!ext.supportLinearFiltering) {
      gl.uniform2f(
        advectionProgram.uniforms.dyeTexelSize,
        buffers.dye.texelSizeX,
        buffers.dye.texelSizeY,
      );
    }
    gl.uniform1i(advectionProgram.uniforms.uVelocity, buffers.velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, buffers.dye.read.attach(1));
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(buffers.dye.write);
    buffers.dye.swap();
  };

  const render = () => {
    const buffers = getBuffers();

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.useProgram(displayProgram.program);
    bindFullscreenGeometry(displayProgram);
    if (config.SHADING) {
      gl.uniform2f(
        displayProgram.uniforms.texelSize,
        1 / gl.drawingBufferWidth,
        1 / gl.drawingBufferHeight,
      );
    }
    gl.uniform1i(displayProgram.uniforms.uTexture, buffers.dye.read.attach(0));
    blit(null);
  };

  const update = () => {
    const now = performance.now();
    let dt = (now - lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    lastUpdateTime = now;

    if (resizeCanvas()) {
      initFramebuffers();
    }

    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
    while (colorUpdateTimer >= 1) {
      colorUpdateTimer -= 1;
      colorFrom = colorTo;
      colorTo = generateColor();
    }
    pointer.color = lerpRgb(colorFrom, colorTo, colorUpdateTimer);

    applyInputs();
    step(dt);
    render();
    raf = requestAnimationFrame(update);
  };

  const onPointerMove = (event: PointerEvent) => {
    updatePointerMoveData(event.clientX, event.clientY);
  };

  const onPointerDown = (event: PointerEvent) => {
    updatePointerMoveData(event.clientX, event.clientY);
    const picked = generateColor();
    colorFrom = picked;
    colorTo = picked;
    colorUpdateTimer = 0;
    pointer.color = picked;
    const dx = 18 * (Math.random() - 0.5);
    const dy = 18 * (Math.random() - 0.5);
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });

  seedScene();
  raf = requestAnimationFrame(update);

  return {
    resize: () => {
      if (resizeCanvas()) {
        initFramebuffers();
      }
    },
    dispose: () => {
      const buffers = getBuffers();

      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);

      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(indexBuffer);

      gl.deleteTexture(buffers.dye.read.texture);
      gl.deleteFramebuffer(buffers.dye.read.fbo);
      gl.deleteTexture(buffers.dye.write.texture);
      gl.deleteFramebuffer(buffers.dye.write.fbo);
      gl.deleteTexture(buffers.velocity.read.texture);
      gl.deleteFramebuffer(buffers.velocity.read.fbo);
      gl.deleteTexture(buffers.velocity.write.texture);
      gl.deleteFramebuffer(buffers.velocity.write.fbo);
      gl.deleteTexture(buffers.divergence.texture);
      gl.deleteFramebuffer(buffers.divergence.fbo);
      gl.deleteTexture(buffers.curl.texture);
      gl.deleteFramebuffer(buffers.curl.fbo);
      gl.deleteTexture(buffers.pressure.read.texture);
      gl.deleteFramebuffer(buffers.pressure.read.fbo);
      gl.deleteTexture(buffers.pressure.write.texture);
      gl.deleteFramebuffer(buffers.pressure.write.fbo);

      gl.deleteProgram(clearProgram.program);
      gl.deleteProgram(splatProgram.program);
      gl.deleteProgram(advectionProgram.program);
      gl.deleteProgram(divergenceProgram.program);
      gl.deleteProgram(curlProgram.program);
      gl.deleteProgram(vorticityProgram.program);
      gl.deleteProgram(pressureProgram.program);
      gl.deleteProgram(gradientSubtractProgram.program);
      gl.deleteProgram(copyProgram.program);
      gl.deleteProgram(displayProgram.program);
    },
  };
}
