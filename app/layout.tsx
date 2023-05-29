import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/Link";
import NavBar from "./components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  console.log("props: ", inter.className);
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-full min-h-screen flex-nowrap">
          <NavBar />
          <div className="px-12 py-6">{props.children}</div>
        </div>
      </body>
    </html>
  );
}
