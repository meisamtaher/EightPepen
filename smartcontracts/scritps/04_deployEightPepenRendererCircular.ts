import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    // 8Pepen Renderer  Circular deployed at address:  0x0e2a20748b3a58BF0F1d187c2Daa412405eb393E
    const name = "Circular Renderer"
    const RendererContractFactory = await ethers.getContractFactory("EightPepenFCRendererCircular");
    const renderer = await RendererContractFactory.deploy(name);
    await renderer.waitForDeployment();
    const rendererAddress = await renderer.getAddress();
    console.log(" 8Pepen Renderer  Circular deployed at address: ", rendererAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
