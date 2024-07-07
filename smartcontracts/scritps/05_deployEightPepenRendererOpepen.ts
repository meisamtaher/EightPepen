import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    // 8Pepen Renderer  Opepen deployed at address:  0x5FbDB2315678afecb367f032d93F642f64180aa3

    const RendererContractFactory = await ethers.getContractFactory("EightPepenFCRendererOpepen");
    const renderer = await RendererContractFactory.deploy();
    await renderer.waitForDeployment();
    const rendererAddress = await renderer.getAddress();
    console.log(" 8Pepen Renderer  Opepen deployed at address: ", rendererAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
