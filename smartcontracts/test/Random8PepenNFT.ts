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
    const PixelColors = 0x1234567890123456789012345678901234562890123412319012345678901230n;
    const ColorPallet = 0x1234567890123456789012FFFFFF901234FFFFFF123456FF00001234560000FFn;
    // Contracts are deployed using the first signer/account by default
    // const [owner, otherAccount] = await hre.viem.getWalletClients();

    const Random8PepenNFT = await ethers.deployContract("Random8PepenNFT");

    // const publicClient = await hre.viem.getPublicClient();

    return {
      Random8PepenNFT,
      PixelColors,
      ColorPallet
    };
  }

  describe("Deployment", function () {
    it("Should Return SVG", async function () {
      const { Random8PepenNFT, PixelColors, ColorPallet  } = await loadFixture(deployRandomNFTFixture);
      const svg = await Random8PepenNFT.getImage(PixelColors,ColorPallet);
      console.log("SVG :", svg);
    });
  });
});
