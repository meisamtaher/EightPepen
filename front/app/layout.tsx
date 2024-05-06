import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import RainbowComponent from "./rainbow";

const inter = Press_Start_2P({weight:"400", subsets: ["greek"] });

export const metadata: Metadata = {
  title: "EightPepen",
  description: "A fully onchain pixel bsed on Opepen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RainbowComponent>
          <NavBar></NavBar>
          {children}
        </RainbowComponent>
      </body>
    </html>

  );
}
