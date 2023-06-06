import { useEffect, useRef } from "react";

const initVertexBuffers = (gl: WebGLRenderingContext): number => {

  const verticesSizes = new Float32Array([
    -0.5, 0.5, 10.0,
     0.5, 0.5, 20.0,
     0.0, -0.5, 30.0,
  ])

  const n = 3
  const FSIZE = verticesSizes.BYTES_PER_ELEMENT

  // 1. 创建缓存区对象
  const vertexSizeBuffer = gl.createBuffer()

  // 2. 将缓冲区对象绑定到WebGL系统中已经存在的 "目标”(target)上(gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer)

  // 3. 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  // 4. 将缓冲区对象分配给 a_Position 变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0)

  // 5. 连接 a_Position 变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position)

  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2 /** 这里必须是 FSIZE * 2 */)

  gl.enableVertexAttribArray(a_PointSize)

  return n
}

export default function MultiAttributeSize_Interleaved() {
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

    const n = initVertexBuffers(gl)

    if (n < 0) {
      console.log('Failed to set the positions of the vertices.')
      return;
    }

    // return -1 if falsy
    // const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

    // gl.vertexAttrib1f(a_PointSize, 5.0)

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 3)

  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
