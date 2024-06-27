import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { writeFileSync } from "fs";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployRandomNFTFixture() {
    let PixelColors:bigint[]=[];
    PixelColors.push(0xffff00ff000000ffffffffffffff000000ffffffffffffffffffffffffffff00n);
    PixelColors.push(0xffff00ff000000ffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffff00ff000000ffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffff00ff000000ffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffff00ff000000ffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffff00ff000000ffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffff00ff000000ffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffff00ffff0000ffffffffffffff000000ffffffffffffffffffffffffffffffn);
    
    const bgColor = 0x0000FF;


    const SixteenPepenFCRenderer = await ethers.deployContract("SixteenPepenFCRenderer");


    return {
      SixteenPepenFCRenderer,
      PixelColors,
      bgColor
    };
  }

  describe("Deployment", function () {
    it("Should Return Sixteen SVG", async function () {
      const { SixteenPepenFCRenderer, PixelColors, bgColor  } = await loadFixture(deployRandomNFTFixture);
      const svg = await SixteenPepenFCRenderer.getSVG([PixelColors[0],PixelColors[1],PixelColors[2],PixelColors[3],PixelColors[4],PixelColors[5],PixelColors[6],PixelColors[7]],bgColor);
      writeFileSync("sixteenPepen.svg", svg, {
        flag: "w"
       })
      console.log("SVG :", svg);
    });
  });
});
