import { useRef, useEffect } from "react";
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ProjMatrix * a_Position;
    v_Color = a_Color;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

const initVertexBuffers = (gl: WebGLRenderingContext) => {
  const verticesColors = new Float32Array([
    // 顶点坐标和颜色
    0.0,
    0.6,
    -0.4,
    0.4,
    1.0,
    0.4, // 绿色三角形在最后
    -0.5,
    -0.4,
    -0.4,
    0.4,
    1.0,
    0.4,
    0.5,
    -0.4,
    -0.4,
    1.0,
    0.4,
    0.4,

    0.5,
    0.4,
    -0.2,
    1.0,
    0.4,
    0.4,
    -0.5,
    0.4,
    -0.2,
    1.0,
    1.0,
    0.4,
    0.0,
    -0.6,
    -0.2,
    1.0,
    1.0,
    0.4,

    0.0,
    0.5,
    0.0,
    0.4,
    0.4,
    1.0,
    -0.5,
    -0.5,
    0.0,
    0.4,
    0.4,
    1.0,
    0.5,
    -0.5,
    0.0,
    1.0,
    0.4,
    0.4,
  ]);
  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  const n = 9;

  const vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return -1;
  }
  gl.vertexAttribPointer(
    a_Color,
    3,
    gl.FLOAT,
    false,
    FSIZE * 6,
    FSIZE * 3 /** 这里应该是 FSIZE * 3 */
  );
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
};

export default function OrthoView() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as unknown as HTMLCanvasElement;
    const nf: HTMLElement = document.getElementById("nearFar")!;
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

    const u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix")!;
    const projMatrix = new Matrix4();

    let g_near = 0.0;
    let g_far = 0.5;

    const keydown = (
      ev: KeyboardEvent,
      gl: WebGLRenderingContext,
      n: number,
      u_ProjMatrix: WebGLUniformLocation,
      projMatrix: Matrix4,
      nf: HTMLElement
    ) => {
      switch (ev.keyCode) {
        case 39:
          g_near += 0.01;
          break;
        case 37:
          g_near -= 0.01;
          break;
        case 38:
          g_far += 0.01;
          break;
        case 40:
          g_far -= 0.01;
          break;
        default:
          return;
      }
      draw(gl, n, u_ProjMatrix, projMatrix, nf);
    };

    const draw = (
      gl: WebGLRenderingContext,
      n: number,
      u_ProjMatrix: WebGLUniformLocation,
      projMatrix: Matrix4,
      nf: HTMLElement
    ) => {
      // viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
      projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

      gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT);

      nf.innerHTML = `near: ${Math.round(g_near * 100) / 100}, far: ${
        Math.round(g_far * 100) / 100
      }`;

      gl.drawArrays(gl.TRIANGLES, 0, n);
    };

    document.addEventListener("keydown", (ev) => {
      ev.stopPropagation();
      keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
    });

    draw(gl, n, u_ProjMatrix, projMatrix, nf);
  });

  return (
    <>
      <canvas ref={ref} id="app" width="360" height="300">
        Your browser doesn&apos;t support WebGL.
      </canvas>
      <p id="nearFar">The near and far values are displayed here.</p>
    </>
  );
}
