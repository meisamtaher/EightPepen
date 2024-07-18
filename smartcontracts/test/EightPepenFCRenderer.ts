import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployRandomNFTFixture() {
    let PixelColors:bigint[]=[];
    PixelColors.push(0xffffffffffffffffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000n);
    const bgColor = 0x000000;
    //0 blue, 1 green , 2 red, 3 black, 4 white
    const name = "Original Renderer"
    const EightPepenRendererFactory = await ethers.getContractFactory("EightPepenFCRenderer");
    const EightPepenFCRenderer = await EightPepenRendererFactory.deploy(name)


    return {
      EightPepenFCRenderer,
      PixelColors,
      bgColor,
      name
    };
  }

  describe("Deployment", function () {
    it("name is set", async function () {
      const { EightPepenFCRenderer, PixelColors, bgColor, name  } = await loadFixture(deployRandomNFTFixture);
      expect(await EightPepenFCRenderer.name()).to.equal(name);
    });
    it("should return SVG", async function(){
      const { EightPepenFCRenderer, PixelColors, bgColor, name  } = await loadFixture(deployRandomNFTFixture);
      const svg = await EightPepenFCRenderer.getSVG([PixelColors[0],PixelColors[1]],bgColor);
      console.log("SVG data:",svg)
    })
  });
});
