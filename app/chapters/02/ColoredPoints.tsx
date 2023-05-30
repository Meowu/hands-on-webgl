import { useEffect, useRef } from "react";

export default function ColoredPoints() {
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
    // 使用 precision 指定变量的范围和精度，这里是中等精度，否则报错：
    // Failed to compile shader: ERROR: 0:2: '' : No precision specified for (float)
    const FSHADER_SOURCE = `
      precision mediump float; 
      uniform vec4 u_FragColor;
      void main() {
        gl_FragColor = u_FragColor;
      }
    `;

    if (!window.initShaders?.(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log("Failed to initialize shader.");
      return;
    }

    // return -1 if falsy
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

    gl.vertexAttrib1f(a_PointSize, 5.0)

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const g_points: [number, number][] = []
    const g_colors: [number, number, number, number][] = []

    canvas.onmousedown = (event) => {
      const { clientX, clientY, target } = event
      const { left, top, width, height } =  (target as HTMLCanvasElement).getBoundingClientRect()
      const x = (clientX - left - width / 2) / (width / 2)
      const y = (height / 2 - (clientY - top)) / (height / 2)
  
      g_points.push([x, y])

      if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0])
      } else if (x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0])
      } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0])
      }

      gl.clear(gl.COLOR_BUFFER_BIT);

      g_points.forEach((point, index) => {
        gl.vertexAttrib3f(a_Position, point[0], point[1], 0.0)
        gl.uniform4f(u_FragColor, ...g_colors[index])
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
