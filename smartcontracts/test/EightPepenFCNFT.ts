import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  async function deployRandomNFTFixture() {
    let PixelColors:bigint[]=[];
    PixelColors.push(0xffffffffffffffffffffffffffff000000ffffffffffffffffffffffffffffffn);
    PixelColors.push(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000n);
    const bgColor = 0x000000;
    //0 blue, 1 green , 2 red, 3 black, 4 white
    const name = "Original Renderer"
    const EightPepenRendererFactory = await ethers.getContractFactory("EightPepenFCRenderer");
    const EightPepenFCRenderer = await EightPepenRendererFactory.deploy(name)

    const EightPepenNFTFactory = await ethers.getContractFactory("EightPepenFCNFT");
    const EightPepenFCNFT = await EightPepenNFTFactory.deploy(await EightPepenFCRenderer.getAddress())

    return {
      EightPepenFCNFT,
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
    it("should return metadata", async function(){
      const {EightPepenFCNFT, PixelColors, bgColor, name  } = await loadFixture(deployRandomNFTFixture);
      const metadata = await EightPepenFCNFT["imageURI(uint256,uint256)"](1,1);
      console.log("SVG data:",metadata)
    })
  });
});
