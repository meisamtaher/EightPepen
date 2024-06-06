import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    // 8Pepen Full Color Renderer deployed at address:  0x7aab67aaC3D1f5DE9EFF7ff8dF91Cc049AD0fEFe
    // 8Pepen Renderer deployed at address:  0x7Ca1564B12B99f36A80a6A9f41137621481dcC42
    // 8Pepen base NFT deployed at address:  0xAFfc13Ebd50B27ed7078A49A3d7eF7f52a862f4A
    // 8 Pepen FC Set Contract Address:  0x7e8316844f7897C34c064Ae9C5b26c925b331545

    const FCRendererContractFactory = await ethers.getContractFactory("SixteenPepenFCRenderer");
    const FCRenderer = await FCRendererContractFactory.deploy();
    await FCRenderer.waitForDeployment();
    const FCRendererAddress = await FCRenderer.getAddress();
    console.log(" 16Pepen Full Color Renderer deployed at address: ", FCRendererAddress);


    const SetNFTContractFactory = await ethers.getContractFactory("SixteenPepenFCNFT");
    const EightPepenSetNFT = await SetNFTContractFactory.deploy(FCRendererAddress);
    await EightPepenSetNFT.waitForDeployment();
    const SetNFTContractAddress = await EightPepenSetNFT.getAddress();
    console.log(" 16 Pepen FC Set Contract Address: ", SetNFTContractAddress);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
