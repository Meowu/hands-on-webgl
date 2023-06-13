import { useRef, useEffect } from "react";
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
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
    // Vertex coordinates and color
    0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // The back blue one 
    -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
     0.5, -1.0,   0.0,  1.0,  0.4,  0.4, 

     0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
    -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
     0.5, -1.0,  -2.0,  1.0,  0.4,  0.4, 

     0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // The front green one
     -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
      0.5, -1.0,  -4.0,  1.0,  0.4,  0.4, 
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


export default function DepthBuffer() {

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

    // 开启隐藏面消除
    gl.enable(gl.DEPTH_TEST)

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')!

    if (!u_MvpMatrix) { 
      console.log('Failed to get u_ViewMatrix or u_MvpMatrix');
      return;
    }

    // 清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const modelMatrix = new Matrix4();
    const viewMatrix = new Matrix4();
    const projMatrix = new Matrix4();
    const mvpMatrix = new Matrix4()

    modelMatrix.setTranslate(0.75, 0, 0)
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0)
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100)

    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    gl.drawArrays(gl.TRIANGLES, 0, n)

    modelMatrix.setTranslate(-0.75, 0, 0)
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)
    // 只修改了模型矩阵
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    gl.drawArrays(gl.TRIANGLES, 0, n)

  })

  return (
    <canvas ref={ref} id="app" width="400" height="400">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}