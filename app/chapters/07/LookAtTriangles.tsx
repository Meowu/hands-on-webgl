import { useRef, useEffect } from "react";
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ViewMatrix * a_Position;
    v_Color = a_Color;
  }
`

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`

const initVertexBuffers = (gl: WebGLRenderingContext) => {
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色
     0.0,  0.5, -0.4, 0.4, 1.0, 0.4, // 绿色三角形在最后
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
     0.5, -0.5, -0.4, 1.0, 0.4, 0.4, 

     0.5,  0.4, -0.2, 1.0, 0.4, 0.4,
    -0.5,  0.4, -0.2, 1.0, 1.0, 0.4,
     0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

     0.0,  0.5,  0.0, 0.4, 0,4, 1.0,
    -0.5, -0.5,  0.0, 0.4, 0.4, 1.0,
     0.5, -0.5,  0.0, 1.0, 0.4, 0.4,
  ])
  const FSIZE = verticesColors.BYTES_PER_ELEMENT

  const n = 9

  const vertexColorBuffer = gl.createBuffer()
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_Position)

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3 /** 这里应该是 FSIZE * 3 */)
  gl.enableVertexAttribArray(a_Color)

  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  return n
}


export default function LookAtTriangles() {

  const ref = useRef<HTMLCanvasElement>(null);


  useEffect(() => {

    const canvas = ref.current as unknown as HTMLCanvasElement;
    const gl = canvas.getContext("webgl")!;

    if (!gl) {
      throw new Error("WebGl not supported.");
    }

    if (!window.initShaders?.(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log("Failed to initialize shader.");
      return;
    }

    const n = initVertexBuffers(gl)
    if (n < 0) {
      console.log('Failed to set the positions of the vertices.')
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
    const viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0)

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, n)
  })

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}