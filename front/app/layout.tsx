import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import RainbowComponent from "./rainbow";

const inter = Press_Start_2P({weight:"400", subsets: ["greek"] });

export const metadata: Metadata = {
  title: "8Pepen",
  description: "A fully onchain pixel NFT based on Opepen",
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
          <div className='flex flex-col w-full h-screen'>
            <NavBar />
            <div className='grow p-8 bg-[#D9D9D9]'>{children}</div>
          </div>
        </RainbowComponent>
      </body>
    </html>

  );
}
