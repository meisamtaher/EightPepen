import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Circular Renderer", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployRandomNFTFixture() {
    let PixelColors:bigint[]=[];
    PixelColors.push(0xffffffffffffffffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000n);
    const bgColor = 0x000000;
    //0 blue, 1 green , 2 red, 3 black, 4 white
    // Contracts are deployed using the first signer/account by default
    // const [owner, otherAccount] = await hre.viem.getWalletClients();

    const EightPepenFCRenderer  = await ethers.deployContract("EightPepenFCRendererCircular");
    // const EightPepenFCNFT = await ethers.deployContract("EightPepenFCNFT");

    // const publicClient = await hre.viem.getPublicClient();

    return {
      EightPepenFCRenderer,
      PixelColors,
      bgColor
    };
  }

  describe("Deployment", function () {
    it("Should Return SVG in OG mode", async function () {
      console.log("THIs ITS HEREEEEEEEEEEEEE")
      const { EightPepenFCRenderer, PixelColors, bgColor  } = await loadFixture(deployRandomNFTFixture);
      const svg = await EightPepenFCRenderer.getSVG([PixelColors[0],PixelColors[1]],bgColor);
      console.log("SVG :", svg);
    });
  });
});
