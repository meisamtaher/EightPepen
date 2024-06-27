import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    // 16Pepen Full Color Renderer deployed at address:  0xA9E27F0fB49e5A89A678c6AB482D12d61fb21C1F
    // 16 Pepen FC Set Contract Address:  0xe395ED69E670208bA0b5d3A7a24c26be542fDDAA

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
