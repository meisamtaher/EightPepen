import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    //8Pepen Renderer deployed at address:  0xd24F7ceC6d599171A85090338dc1A89305E1467D
    //8Pepen NFT deployed at address:  0xb94A88627feC054757A9A4f3cdab86Da391aA331

    // const RendererContractFactory = await ethers.getContractFactory("EightPepenRenderer");
    // const renderer = await RendererContractFactory.deploy();
    // await renderer.waitForDeployment();
    const rendererAddress = "0xd24F7ceC6d599171A85090338dc1A89305E1467D"
    console.log(" 8Pepen Renderer deployed at address: ", rendererAddress);

    // const NFTContractFactory = await ethers.getContractFactory("EightPepenNFT");
    // const EightPepenNFT = await NFTContractFactory.deploy(rendererAddress);
    // await EightPepenNFT.waitForDeployment();
    const NFTContractAddress = "0xb94A88627feC054757A9A4f3cdab86Da391aA331"
    console.log(" 8Pepen base NFT deployed at address: ", NFTContractAddress);
    const SetNFTContractFactory = await ethers.getContractFactory("EightPepenSetNFT");
    const EightPepenSetNFT = await SetNFTContractFactory.deploy(rendererAddress,NFTContractAddress);
    await EightPepenSetNFT.waitForDeployment();
    const SetNFTContractAddress = await EightPepenSetNFT.getAddress();
    console.log(" 8 Pepen Set Contract Address: ", SetNFTContractAddress);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
