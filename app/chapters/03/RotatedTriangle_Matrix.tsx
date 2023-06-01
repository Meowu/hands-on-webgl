import { useEffect, useRef } from "react";

const initVertexBuffers = (gl: WebGLRenderingContext): number => {

  const vertices = new Float32Array([
    0, 0.5, -0.5, -0.5, 0.5, -0.5
  ])

  const n = 3

  // 1. 创建缓存区对象
  const vertexBuffer = gl.createBuffer()

  // 2. 将缓冲区对象绑定到WebGL系统中已经存在的 "目标”(target)上(gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  // 3. 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  // 4. 将缓冲区对象分配给 a_Position 变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

  // 5. 连接 a_Position 变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position)

  return n
}

export default function RotatedTriangle_Matrix() {
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
    // x' = x * cosB - y * sinB
    // y' = x * sinB + y * cosB
    const VSHADER_SOURCE = `
      attribute vec4 a_Position;
      uniform mat4 u_xformMatrix;
      void main() {
        gl_Position = u_xformMatrix * a_Position;
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
    // const ANGLE = 90
    // const radian = Math.PI * ANGLE / 180
    // const cosB = Math.cos(radian)
    // const sinB = Math.sin(radian)
    // rotated matrix.
    // const xformMatrix = new Float32Array([
    //   cosB, sinB, 0.0, 0.0,
    //   -sinB, cosB,0.0, 0.0,
    //   0.0, 0.0, 1.0, 0.0,
    //   0.0, 0.0, 0.0, 1.0
    // ])

    // const Tx = 0.5
    // const Ty = 0.5
    // const Tz = 0.0
    // // translated matrix.
    // const xformMatrix = new Float32Array([
    //   1.0, 0.0, 0.0, 0.0,
    //   0.0, 1.0, 0.0, 0.0,
    //   0.0, 0.0, 1.0, 0.0,
    //   Tx,  Ty,  Tz,  1.0,
    // ])

    const Sx = 1.0
    const Sy = 1.5
    const Sz = 1.0
    //  skewed matrix.
    const xformMatrix = new Float32Array([
      Sx, 0.0, 0.0, 0.0,
      0.0, Sy, 0.0, 0.0,
      0.0, 0.0, Sz, 0.0,
      0.0,  0.0,  0.0,  1.0,
    ])

    if (n < 0) {
      console.log('Failed to set the positions of the vertices.')
      return;
    }

    // const u_SinB = gl.getUniformLocation(gl.program, 'u_SinB')
    // const u_CosB = gl.getUniformLocation(gl.program, 'u_CosB')
    const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
    // 只在绘制单个点的时候有用。
    // gl.vertexAttrib1f(a_PointSize, 5.0)
    // gl.uniform1f(u_SinB, sinB)
    // gl.uniform1f(u_CosB, cosB)
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix)
  
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // 改成绘制三角形。
    gl.drawArrays(gl.TRIANGLES, 0, 3)

  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
