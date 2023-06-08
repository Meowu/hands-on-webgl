import { useEffect, useRef } from "react";
// import car from './car.png'

// 顶点着色器
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`;
// 片元着色器
const FSHADER_SOURCE = `
  precision mediump float; 
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  varying vec2 v_TexCoord;
  void main() {
    vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
    vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
    gl_FragColor = color0 * color1;
  }
`;

const initVertexBuffers = (gl: WebGLRenderingContext): number => {
  const verticesTexCoords = new Float32Array([
    -0.5,  0.5, 0.0, 1.0, 
    -0.5, -0.5, 0.0, 0.0, 
     0.5,  0.5, 1.0, 1.0, 
     0.5, -0.5, 1.0, 0.0,
  ]);

  const n = 4;
  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  // 1. 创建缓存区对象
  const vertexCoordBuffer = gl.createBuffer();

  // 2. 将缓冲区对象绑定到WebGL系统中已经存在的 "目标”(target)上(gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexCoordBuffer);

  // 3. 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");

  // 4. 将缓冲区对象分配给 a_Position 变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

  // 5. 连接 a_Position 变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  const a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");

  gl.vertexAttribPointer(
    a_TexCoord,
    2,
    gl.FLOAT,
    false,
    FSIZE * 4,
    FSIZE * 2 /** 这里必须是 FSIZE * 2 */
  );

  gl.enableVertexAttribArray(a_TexCoord);

  return n;
};

let g_texUnit0 = false
let g_texUnit1 = false

const loadTexture = (
  gl: WebGLRenderingContext,
  n: number,
  texture: WebGLTexture,
  u_Sampler: WebGLUniformLocation,
  image: HTMLImageElement,
  texUnit: 0 | 1,
) => {
  // 对纹理图像进行 Y 轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  if (texUnit === 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true
  }
  if (texUnit === 1) {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数，即如何根据纹理坐标获取纹素颜色、按哪种方式重复填充纹理。
  // 每个纹理参数都有一个默认值，通常你可以不调用gl.texParameteri()就使用默认值。
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // 配置纹理图像，第三个参数 jpg -> RGB, png -> RGBA, BMP -> RGB
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 这里要传递不同号的纹理。
  gl.uniform1i(u_Sampler, texUnit);

  gl.clear(gl.COLOR_BUFFER_BIT);

  if (g_texUnit0 && g_texUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
};

const initTextures = (gl: WebGLRenderingContext, n: number) => {

  const texture0 = gl.createTexture()!;
  const texture1 = gl.createTexture()!;

  const u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  const u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");

  if (!u_Sampler0 || !u_Sampler1) {
    return;
  }

  const image0 = new Image();
  const image1 = new Image();

  image0.onload = () => {
    loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
  };

  image1.onload = () => {
    loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
  };

  image0.src = "/sky.jpg";
  image1.src = "/circle.gif";
  // image.src = "/car.png"; // 为什么这个不行。
  return true;
};

export default function MultiTexture() {
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

    if (!initTextures(gl, n)) {
      console.log("Failed to init textures.");
      return;
    }
  });

  return (
    <canvas ref={ref} id="app" width="360" height="300">
      Your browser doesn&apos;t support WebGL.
    </canvas>
  );
}
