import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar";
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  console.log("props: ", inter.className);
  return (
    <html lang="en" className="h-full">
      <script src="/lib/cuon-matrix.js" async />
      <script src="/lib/cuon-utils.js" async />
      <script src="/lib/webgl-debug.js" async />
      <script src="/lib/webgl-utils.js" async />
      <body className={inter.className + ' h-full min-h-screen'}>
        <div className="flex flex-col h-full flex-nowrap">
          <NavBar />
          <div className="px-12 py-6 overflow-auto">{props.children}</div>
        </div>
      </body>
    </html>
  );
}
