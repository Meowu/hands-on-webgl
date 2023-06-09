import { useEffect, useRef } from "react";

export default function ClickedPoints() {
  /**
  /* 要用 null 初始，不如报错 -> 不能将类型“MutableRefObject<HTMLCanvasElement | undefined>”
  /* 分配给类型“LegacyRef<HTMLCanvasElement> | undefined”。
  */
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current as unknown as HTMLCanvasElement;
    const gl = canvas.getContext("webgl")!;

    if (!gl) {
      throw new Error("WebGl not supported.");
    }

    // 顶点着色器
    const VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute float a_PointSize;
      void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
      }
    `;
    // 片元着色器
    const FSHADER_SOURCE = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 0.0);
      }
    `;

    if (!window.initShaders?.(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log("Failed to initialize shader.");
      return;
    }

    // return -1 if falsy
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

    gl.vertexAttrib1f(a_PointSize, 5.0)

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const g_points: [number, number][] = []

    canvas.onmousedown = (event) => {
      const { clientX, clientY, target } = event
      const { left, top, width, height } =  (target as HTMLCanvasElement).getBoundingClientRect()
      const x = (clientX - left - width / 2) / (width / 2)
      const y = (height / 2 - (clientY - top)) / (height / 2)
  
      g_points.push([x, y])

      gl.clear(gl.COLOR_BUFFER_BIT);

      g_points.forEach((point) => {
        gl.vertexAttrib3f(a_Position, point[0], point[1], 0.0)
        gl.drawArrays(gl.POINTS, 0, 1);
      })
    }



  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
