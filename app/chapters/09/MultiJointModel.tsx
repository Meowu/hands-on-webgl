'use client'
import { useEffect, useRef } from "react";
import { initArrayBuffer } from "../../utils";

// fixme: 明明用了 use client, 为什么这个页面原地刷新会报 Matrix4 is undefined 的错误。
// 顶点着色器
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));
    vec4 color = vec4(1.0, 0.4, 0.0, 1.0);
    vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);
    float nDotL = max(dot(normal, lightDirection), 0.0);
    v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);
  }
`;
// 片元着色器
const FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

const initVertexBuffers = (gl: WebGLRenderingContext) => {
    // Vertex coordinates（a cuboid 3.0 in width, 10.0 in height, and 3.0 in length with its origin at the center of its bottom)
    const vertices = new Float32Array([
      0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
      0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
      0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
     -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
     -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
      0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
    ]);
  
    // Normal
    const normals = new Float32Array([
      0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
     -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
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

    console.log('before arry init')
    if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;

    console.log('after init array buffer.')
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    const indexBuffer = gl.createBuffer()
    if (!indexBuffer) {
      console.log('failed to create the buffer object.')
      return -1
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
}

const ANGLE_STEP = 3.0
let g_arm1Angle = -90.0
let g_joint1Angle = 45.0
let g_joint2Angle = 0.0
let g_joint3Angle = 0.0

let g_modelMatrix = new Matrix4()
let g_mvpMatrix = new Matrix4()
let g_normalMatrix = new Matrix4()

const g_matrixStack: Matrix4[] = []

const pushMatrix = (m: Matrix4) => {
  const m2 = new Matrix4(m)
  g_matrixStack.push(m2)
}

const popMatrix = (): Matrix4 => g_matrixStack.pop()!


const drawBox = (gl: WebGLRenderingContext, n: number, width: number, height: number, depth: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation, u_NormalMatrix: WebGLUniformLocation) => {
  
  pushMatrix(g_modelMatrix)
  // 缩放立方体并绘制
  g_modelMatrix.scale(width, height, depth)
  // 计算模型视图投影矩阵并传给 u_MvpMatrix 变量
  g_mvpMatrix.set(viewProjMatrix)
  g_mvpMatrix.multiply(g_modelMatrix)
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements)

  g_normalMatrix.setInverseOf(g_modelMatrix)
  g_normalMatrix.transpose()
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements)

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
  g_modelMatrix = popMatrix()
}

const draw = (gl: WebGLRenderingContext, n: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation, u_NormalMatrix: WebGLUniformLocation) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // 绘制基座
  const baseHeight = 2.0
  g_modelMatrix.setTranslate(0.0, -12.0, 0.0)
  drawBox(gl, n, 10.0, baseHeight, 10.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)

  // arm1
  const arm1Length = 10.0
  g_modelMatrix.translate(0.0, baseHeight, 0.0) // move onto the base
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0)
  drawBox(gl, n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)

  // arm2
  const arm2Length = 10.0
  g_modelMatrix.translate(0.0, arm1Length, 0.0)
  g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0)
  // g_modelMatrix.scale(1.3, 1.0, 1.3)
  drawBox(gl, n, 4.0, arm2Length, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)

  // parm
  const palmLength = 2.0
  g_modelMatrix.translate(0.0, arm2Length, 0.0)
  g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0)
  drawBox(gl, n, 2.0, palmLength, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)

  // 移至 palm 一端的中点
  g_modelMatrix.translate(0.0, palmLength, 0.0)

  // finger1
  pushMatrix(g_modelMatrix)
  g_modelMatrix.translate(0.0, 0.0, 2.0)
  g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0)
  drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
  // 恢复原来的矩阵位置
  g_modelMatrix = popMatrix()

  // finger2
  g_modelMatrix.translate(0.0, 0.0, -2.0)
  g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0)
  drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
}

const keydown = (event: KeyboardEvent, gl: WebGLRenderingContext, n: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation, u_NormalMatrix: WebGLUniformLocation) => {
  switch (event.keyCode) {
    case 38:
      if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
      break
    case 40:
      if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
      break;
    case 39:
      g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360
      break
    case 37:
      g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360
      break
    case 90: // Z 键，joint2 正向转动
      g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360
      break
    case 88: // X 键
      g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360
      break
    case 86: // V 键使 joint3 正向转动
      if (g_joint3Angle < 60.0) g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360
      break
    case 67: // C
      if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360
      break
    default: return;
  }

  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
}

export default function MultiJointModel() {
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

    const n = initVertexBuffers(gl)
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    // return -1 if falsy
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
    if (!u_MvpMatrix || !u_NormalMatrix) {
      console.log('Failed to get the storage location');
      return;
    }

  // Calculate the view projection matrix
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  console.log('draw ->', gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
  // Register the event handler to be called when keys are pressed
  document.onkeydown = function(ev){ 
    keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); 
  };

  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);  // Draw the robot arm
  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
