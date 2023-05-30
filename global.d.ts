export {}
declare global {
  interface Window {
    initShaders: (...args: any[]) => boolean
  }

  interface WebGLRenderingContext {
    program: WebGLProgram
  }

}

// declare var WebGLRenderingContext: {
//   program: WebGLProgram
// }