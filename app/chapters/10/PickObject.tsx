import { useEffect, useRef } from "react";
import { initArrayBuffer } from "../../utils";
// import car from './car.png'

// 顶点着色器
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  uniform bool u_Clicked;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    if (u_Clicked) {
      v_Color = vec4(1.0, 0.0, 0.0, 1.0);
    } else {
      v_Color = a_Color;
    }
  }
`;

// 片元着色器
const FSHADER_SOURCE = `
  precision mediump float; 
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

const ANGLE_STEP = 20.0

const initVertexBuffers = (gl: WebGLRenderingContext): number => {
    // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  const vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);

  const colors = new Float32Array([   // Colors
    0.2, 0.58, 0.82,   0.2, 0.58, 0.82,   0.2,  0.58, 0.82,  0.2,  0.58, 0.82, // v0-v1-v2-v3 front
    0.5,  0.41, 0.69,  0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
    0.0,  0.32, 0.61,  0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v0-v5-v6-v1 up
    0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v1-v6-v7-v2 left
    0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v7-v4-v3-v2 down
    0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
   ]);

  // Indices of the vertices
  const indices = new Uint8Array([
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // right
      8, 9,10,   8,10,11,    // up
     12,13,14,  12,14,15,    // left
     16,17,18,  16,18,19,    // down
     20,21,22,  20,22,23     // back
   ]);

  if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1
  if (!initArrayBuffer(gl, 'a_Color', colors, gl.FLOAT, 3)) return -1

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  return indices.length
};

const check = (gl: WebGLRenderingContext, n: number, x: number, y: number, currentAngle: number, u_Clicked: WebGLUniformLocation, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation) => {

  let picked = false
  gl.uniform1i(u_Clicked, 1) // Pass true to clicked.
  draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix) // draw cube with red.
  const pixels = new Uint8Array(4) // array for storing the pixel value.
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

  console.log('pixels: ', pixels)
  if (pixels[0] === 255) {
    picked = true
  }

  gl.uniform1i(u_Clicked, 0)
  draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix)

  return picked
}

const g_MvpMatrix = new Matrix4()

let last = Date.now()
const animate = (angle: number) => {
  const now = Date.now()
  const elapsed = now - last
  last = now
  const newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
  return newAngle % 360
}

const draw = (gl: WebGLRenderingContext, n: number, currentAngle: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation) => {
  g_MvpMatrix.set(viewProjMatrix)
  g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0) // rotation around x-axis
  g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0) // rotation around y-axis
  g_MvpMatrix.rotate(currentAngle, 0.0, 0.0, 1.0) // rotation around y-axis
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
}

export default function PickObject() {
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

    if (!window.initShaders?.(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log("Failed to initialize shader.");
      return;
    }

    const n = initVertexBuffers(gl);

    if (n < 0) {
      console.log("Failed to set the positions of the vertices.");
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST)

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    let u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked')
  
    if (!u_MvpMatrix || !u_Clicked) {
      console.log('Failed to get the storage location of uniform variable.')
      return;
    }

    const viewProjMatrix = new Matrix4()
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0)
    viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    gl.uniform1i(u_Clicked, 0)

    let currentAngle = 0.0
    canvas.onmousedown = ev => {
      let x = ev.clientX
      let y = ev.clientY
      const { left, top, right, bottom } = ev.target!.getBoundingClientRect()
      if (left <= x && x < right && top <= y && y < bottom) {
        const x_in_canvas = x - left
        const y_in_canvas = bottom - y
        const picked = check(gl, n, x_in_canvas, y_in_canvas, currentAngle, u_Clicked!, viewProjMatrix, u_MvpMatrix)
        if (picked) alert('The cube was selected!')
      }
    }

    const tick = () => {
      currentAngle = animate(currentAngle)
      draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix)
      requestAnimationFrame(tick)
    }
    tick()
  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
