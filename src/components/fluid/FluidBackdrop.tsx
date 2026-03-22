"use client";

import { useEffect, useRef } from "react";
import { startDyeFluid } from "@/lib/webglDyeFluid";

const SIM_SIZE = 384;

export function FluidBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctrl = startDyeFluid(canvas, SIM_SIZE);
    if (!ctrl) return;

    const onResize = () => ctrl.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctrl.dispose();
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden dark:opacity-[0.82]"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-100"
        style={{ display: "block", filter: "saturate(1.35) contrast(1.02)" }}
      />
    </div>
  );
}
