type GL = WebGLRenderingContext | WebGL2RenderingContext;

type TextureFormat = {
  internalFormat: number;
  format: number;
};

type GlContext = {
  gl: GL;
  isWebGL2: boolean;
  ext: {
    formatRGBA: TextureFormat;
    formatRG: TextureFormat;
    formatR: TextureFormat;
    halfFloatTexType: number;
    supportLinearFiltering: boolean;
  };
};

type UniformMap = Record<string, WebGLUniformLocation | null>;

export type SingleFbo = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (unit: number) => number;
};

export type DoubleFbo = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: SingleFbo;
  write: SingleFbo;
  swap: () => void;
};

function compileShader(gl: GL, type: number, source: string, keywords?: string[]) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }

  const keywordPrefix =
    keywords && keywords.length > 0
      ? `${keywords.map((keyword) => `#define ${keyword}`).join("\n")}\n`
      : "";
  gl.shaderSource(shader, `${keywordPrefix}${source}`);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function linkProgram(gl: GL, vertex: WebGLShader, fragment: WebGLShader) {
  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function createProgram(
  gl: GL,
  vertexSource: string,
  fragmentSource: string,
  keywords?: string[],
) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource, keywords);
  if (!vertex || !fragment) {
    return null;
  }

  const program = linkProgram(gl, vertex, fragment);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!program) {
    return null;
  }

  const uniforms: UniformMap = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i += 1) {
    const activeUniform = gl.getActiveUniform(program, i);
    if (!activeUniform) {
      continue;
    }
    uniforms[activeUniform.name] = gl.getUniformLocation(program, activeUniform.name);
  }

  return {
    program,
    uniforms,
    positionLocation: gl.getAttribLocation(program, "aPosition"),
  };
}

function supportRenderTextureFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number,
) {
  const texture = gl.createTexture();
  if (!texture) {
    return false;
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  const fbo = gl.createFramebuffer();
  if (!fbo) {
    gl.deleteTexture(texture);
    return false;
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

  gl.deleteFramebuffer(fbo);
  gl.deleteTexture(texture);
  return status === gl.FRAMEBUFFER_COMPLETE;
}

function getSupportedFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number,
): TextureFormat | null {
  if (supportRenderTextureFormat(gl, internalFormat, format, type)) {
    return { internalFormat, format };
  }

  if ("R16F" in gl && internalFormat === (gl as WebGL2RenderingContext).R16F) {
    return getSupportedFormat(
      gl,
      (gl as WebGL2RenderingContext).RG16F,
      (gl as WebGL2RenderingContext).RG,
      type,
    );
  }

  if ("RG16F" in gl && internalFormat === (gl as WebGL2RenderingContext).RG16F) {
    return getSupportedFormat(
      gl,
      (gl as WebGL2RenderingContext).RGBA16F,
      gl.RGBA,
      type,
    );
  }

  return null;
}

export function getWebGLContext(canvas: HTMLCanvasElement): GlContext | null {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  let gl: GL | null = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
  const isWebGL2 = Boolean(gl);

  if (!gl) {
    gl =
      (canvas.getContext("webgl", params) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl", params) as WebGLRenderingContext | null);
  }

  if (!gl) {
    return null;
  }

  let halfFloatTexType = 0;
  let supportLinearFiltering = false;

  if (isWebGL2) {
    const webgl2 = gl as WebGL2RenderingContext;
    webgl2.getExtension("EXT_color_buffer_float");
    supportLinearFiltering = Boolean(webgl2.getExtension("OES_texture_float_linear"));
    halfFloatTexType = webgl2.HALF_FLOAT;
  } else {
    const halfFloat = gl.getExtension("OES_texture_half_float");
    supportLinearFiltering = Boolean(gl.getExtension("OES_texture_half_float_linear"));
    if (!halfFloat) {
      return null;
    }
    halfFloatTexType = halfFloat.HALF_FLOAT_OES;
  }

  const formatRGBA = isWebGL2
    ? getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, gl.RGBA, halfFloatTexType)
    : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  const formatRG = isWebGL2
    ? getSupportedFormat(
        gl,
        (gl as WebGL2RenderingContext).RG16F,
        (gl as WebGL2RenderingContext).RG,
        halfFloatTexType,
      )
    : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  const formatR = isWebGL2
    ? getSupportedFormat(
        gl,
        (gl as WebGL2RenderingContext).R16F,
        (gl as WebGL2RenderingContext).RED,
        halfFloatTexType,
      )
    : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);

  if (!formatRGBA || !formatRG || !formatR) {
    return null;
  }

  gl.clearColor(0, 0, 0, 0);

  return {
    gl,
    isWebGL2,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering,
    },
  };
}

export function scaleByPixelRatio(input: number) {
  const pixelRatio = window.devicePixelRatio || 1;
  return Math.floor(input * pixelRatio);
}

export function correctDeltaX(canvas: HTMLCanvasElement, delta: number) {
  const aspectRatio = canvas.width / canvas.height;
  return aspectRatio < 1 ? delta * aspectRatio : delta;
}

export function correctDeltaY(canvas: HTMLCanvasElement, delta: number) {
  const aspectRatio = canvas.width / canvas.height;
  return aspectRatio > 1 ? delta / aspectRatio : delta;
}

export function getResolution(gl: GL, resolution: number) {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (aspectRatio < 1) {
    aspectRatio = 1 / aspectRatio;
  }

  const min = Math.round(resolution);
  const max = Math.round(resolution * aspectRatio);

  if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
    return { width: max, height: min };
  }

  return { width: min, height: max };
}

export function createFBO(
  gl: GL,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number,
): SingleFbo {
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.createTexture();
  const fbo = gl.createFramebuffer();

  if (!texture || !fbo) {
    throw new Error("Unable to create framebuffer resources");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    texture,
    fbo,
    width: w,
    height: h,
    texelSizeX: 1 / w,
    texelSizeY: 1 / h,
    attach: (unit: number) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return unit;
    },
  };
}

export function createDoubleFBO(
  gl: GL,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number,
): DoubleFbo {
  let fbo1 = createFBO(gl, w, h, internalFormat, format, type, param);
  let fbo2 = createFBO(gl, w, h, internalFormat, format, type, param);

  return {
    width: w,
    height: h,
    texelSizeX: fbo1.texelSizeX,
    texelSizeY: fbo1.texelSizeY,
    get read() {
      return fbo1;
    },
    set read(value: SingleFbo) {
      fbo1 = value;
    },
    get write() {
      return fbo2;
    },
    set write(value: SingleFbo) {
      fbo2 = value;
    },
    swap() {
      const temp = fbo1;
      fbo1 = fbo2;
      fbo2 = temp;
    },
  };
}

export function resizeFBO(
  gl: GL,
  target: SingleFbo,
  program: ReturnType<typeof createProgram>,
  bindFullscreenGeometry: (program: ReturnType<typeof createProgram>) => void,
  blit: (target: SingleFbo | null, clear?: boolean) => void,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number,
) {
  if (!program) {
    return target;
  }

  const newFBO = createFBO(gl, w, h, internalFormat, format, type, param);
  gl.useProgram(program.program);
  bindFullscreenGeometry(program);
  gl.uniform1i(program.uniforms.uTexture, target.attach(0));
  blit(newFBO);
  gl.deleteTexture(target.texture);
  gl.deleteFramebuffer(target.fbo);
  return newFBO;
}

export function resizeDoubleFBO(
  gl: GL,
  target: DoubleFbo,
  copyProgram: ReturnType<typeof createProgram>,
  bindFullscreenGeometry: (program: ReturnType<typeof createProgram>) => void,
  blit: (target: SingleFbo | null, clear?: boolean) => void,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number,
) {
  if (target.width === w && target.height === h) {
    return target;
  }

  target.read = resizeFBO(
    gl,
    target.read,
    copyProgram,
    bindFullscreenGeometry,
    blit,
    w,
    h,
    internalFormat,
    format,
    type,
    param,
  );
  gl.deleteTexture(target.write.texture);
  gl.deleteFramebuffer(target.write.fbo);
  target.write = createFBO(gl, w, h, internalFormat, format, type, param);
  target.width = w;
  target.height = h;
  target.texelSizeX = 1 / w;
  target.texelSizeY = 1 / h;
  return target;
}
