import { useState, useEffect, useRef } from "react";

export default function HelloCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current as unknown as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      throw new Error("WebGl not supported.");
    }

    gl.clearColor(1.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
