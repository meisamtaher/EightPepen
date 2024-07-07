import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    //8Pepen Renderer  OG deployed at address:  0xA34fc28D779FcCecad023305eFD72319d94B4e7C

    const RendererContractFactory = await ethers.getContractFactory("EightPepenFCRendererCircular");
    const renderer = await RendererContractFactory.deploy();
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
