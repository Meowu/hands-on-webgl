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
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }
`;

const initVertexBuffers = (gl: WebGLRenderingContext): number => {
  const verticesTexCoords = new Float32Array([
    -0.5,  0.5, -0.3, 1.7, 
    -0.5, -0.5, -0.3, -0.2, 
     0.5,  0.5, 1.7, 1.7, 
     0.5, -0.5, 1.7, -0.2,
  ]);

  const n = 4;
  console.log("bl: ", verticesTexCoords.byteLength);
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

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
};

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

export default function TexturedQuad() {
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
