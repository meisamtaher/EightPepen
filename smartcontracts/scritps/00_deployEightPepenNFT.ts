import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();

    const RendererContractFactory = await ethers.getContractFactory("EightPepenRenderer");
    const renderer = await RendererContractFactory.deploy();
    await renderer.waitForDeployment();
    const rendererAddress = await renderer.getAddress();
    console.log(" 8Pepen Renderer deployed at address: ", rendererAddress);

    const NFTContractFactory = await ethers.getContractFactory("EightPepenNFT");
    const EightPepenNFT = await NFTContractFactory.deploy(rendererAddress);
    await EightPepenNFT.waitForDeployment();
    const NFTContractAddress = await EightPepenNFT.getAddress();
    console.log(" 8Pepen Renderer deployed at address: ", NFTContractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
