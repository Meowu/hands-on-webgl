import { useState, useEffect, useRef } from "react";

export default function Component() {
  const ref = useRef();
  useEffect(() => {
    console.log("ref", ref.current);
    const canvas = ref.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      throw new Error("WebGl not supported.");
    }

    const VSHADER_SOURCE = `
  void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0
  }
`;
    const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0)
  }
`;

    //        if (!gl.initShaders()) {
    //            console.log()
    //        }

    gl.clearColor(1.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
