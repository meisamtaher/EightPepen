import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    // 8Pepen Full Color Renderer deployed at address:  0xd05990C812045906aca7888a0256ED813652f549
    // 8 Pepen FC Set Contract Address:  0x681DEf78f2090837C79eA9B318B7b46E385ce1ad
    const name = "Original Renderer"
    const EightPepenRendererFactory = await ethers.getContractFactory("EightPepenFCRenderer");
    const EightPepenFCRenderer = await EightPepenRendererFactory.deploy(name)
    await EightPepenFCRenderer.waitForDeployment();
    const EithPepenFCRendererAddress = await EightPepenFCRenderer.getAddress();
    console.log(" 8Pepen Full Color Renderer deployed at address: ", EithPepenFCRendererAddress);
    
    const EightPepenNFTFactory = await ethers.getContractFactory("EightPepenFCNFT");
    const EightPepenFCNFT = await EightPepenNFTFactory.deploy(EithPepenFCRendererAddress)
    await EightPepenFCNFT.waitForDeployment();
    const SetNFTContractAddress = await EightPepenFCNFT.getAddress();
    console.log(" 8 Pepen FC Set Contract Address: ", SetNFTContractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
