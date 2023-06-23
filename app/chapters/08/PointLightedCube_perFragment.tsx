import { useEffect, useRef } from "react";

const initVertexBuffers = (gl: WebGLRenderingContext): number => {

  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  const vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  ]);


  const colors = new Float32Array([    // Colors
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
 ]);


  const normals = new Float32Array([    // Normal
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
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

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

  // Create a buffer object
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }
  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

const initArrayBuffer = (gl: WebGLRenderingContext, attribute: string, data: ArrayBufferLike, num: number, type: number) => {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}

// 顶点着色器
const VSHADER_SOURCE =
  `attribute vec4 a_Position;
   attribute vec4 a_Color;
   attribute vec4 a_Normal;
   uniform mat4 u_MvpMatrix;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_NormalMatrix;
   uniform vec3 u_LightColor;
   uniform vec3 u_LightPosition;
   uniform vec3 u_AmbientLight;
   varying vec4 v_Color;
   varying vec3 v_Normal;
   varying vec3 v_Position;
   void main() {
     gl_Position = u_MvpMatrix * a_Position;
     v_Position = vec3(u_ModelMatrix * a_Position);
     v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
     v_Color = a_Color;
   }`

// Fragment shader program
const FSHADER_SOURCE =
  `#ifdef GL_ES
    precision mediump float;
    #endif
    uniform vec3 u_LightColor;
    uniform vec3 u_LightPosition;
    uniform vec3 u_AmbientLight;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    varying vec4 v_Color;
    void main() {
      vec3 normal = normalize(v_Normal);
      vec3 lightDirection = normalize(u_LightPosition - v_Position);
      float nDotL = max(dot(lightDirection, normal), 0.0);
      vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;
      vec3 ambient = u_AmbientLight * v_Color.rbg;
      gl_FragColor = vec4(diffuse + ambient, v_Color.a);
    }`

export default function PointLightedCube_perFragment() {
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
      console.log('Failed to set the positions of the vertices.')
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage location of u_MvpMatrix
    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    if (!u_MvpMatrix) { 
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
    }

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

    gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
  
    const modelMatrix = new Matrix4();
    const mvpMatrix = new Matrix4();
    const normalMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    modelMatrix.setRotate(90, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
