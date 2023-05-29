import { Html, Head, Main, NextScript } from 'next/document';
// import Script from "next/script";
 
export default function Document() {
  return (
    <Html>
      <Head>
      {/* <script src="/lib/cuon-matrix.js" async />
      <script src="/lib/cuon-utils.js" async />
      <script src="/lib/webgl-debug.js" async />
      <script src="/lib/webgl-utils.js" async /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}