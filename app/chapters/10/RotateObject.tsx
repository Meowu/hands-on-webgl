import { useEffect, useRef } from "react";
import { initArrayBuffer } from "../../utils";
// import car from './car.png'

// 顶点着色器
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  uniform mat4 u_MvpMatrix;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }
`;
// 片元着色器
const FSHADER_SOURCE = `
  precision mediump float; 
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }
`;

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

  const texCoords = new Float32Array([   // Texture coordinates
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
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

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }

  if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1
  if (!initArrayBuffer(gl, 'a_TexCoord', texCoords, gl.FLOAT, 2)) return -1

  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  return indices.length
};

const loadTexture = (
  gl: WebGLRenderingContext,
  n: number,
  texture: WebGLTexture,
  u_Sampler: WebGLUniformLocation,
  image: HTMLImageElement
) => {
  // 对纹理图像进行 Y 轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  // 开启 0 号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数，即如何根据纹理坐标获取纹素颜色、按哪种方式重复填充纹理。
  // 每个纹理参数都有一个默认值，通常你可以不调用gl.texParameteri()就使用默认值。
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // 配置纹理图像，第三个参数 jpg -> RGB, png -> RGBA, BMP -> RGB
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将 0 号纹理传递给着色器
  gl.uniform1i(u_Sampler, 0);
};

const g_MvpMatrix = new Matrix4()

const draw = (gl: WebGLRenderingContext, n: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation, currentAngle: number[]) => {
  g_MvpMatrix.set(viewProjMatrix)
  g_MvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0) // rotation around x-axis
  g_MvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0) // rotation around y-axis
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
}

const initTextures = (gl: WebGLRenderingContext, n: number) => {
  const texture = gl.createTexture()!;

  const u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler")!;

  const image = new Image();

  image.onload = () => {
    loadTexture(gl, n, texture, u_Sampler, image);
  };

  image.src = "/sky.jpg";
  // image.src = "/car.png"; // 为什么这个不行。
  return true;
};

const initEventHandlers = (canvas: HTMLCanvasElement, currentAngle: number[]) => {
  let dragging = false
  let lastX = -1
  let lastY = -1

  canvas.onmousedown = (event) => {
    const x = event.clientX
    const y = event.clientY
    const { left, top, right, bottom } = event.target!.getBoundingClientRect()
    if (left <= x && x < right && top <= y && y <= bottom) {
      lastX = x
      lastY = y
      dragging = true
    }
  }

  canvas.onmouseup = event => {
    dragging = false
  }

  canvas.onmousemove = event => {
    const x = event.clientX
    const y = event.clientY
    if (dragging) {
      const factor = 100 / canvas.height
      const dx = factor * (x - lastX)
      const dy = factor * (y - lastY)
      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy))
      currentAngle[1] = currentAngle[1] + dx
    }
    lastX = x
    lastY = y
  }
}

export default function RoateObject() {
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
    if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of uniform variable.')
      return;
    }

    const viewProjMatrix = new Matrix4()
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0)
    viewProjMatrix.lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)
    const currentAngle = [0.0, 0.0]
    initEventHandlers(canvas, currentAngle)

    if (!initTextures(gl, n)) {
      console.log("Failed to init textures.");
      return;
    }

    const tick = () => {
      draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle)
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
