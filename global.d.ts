export {}
declare global {
  interface Window {
    initShaders: (...args: any[]) => boolean
  }
}