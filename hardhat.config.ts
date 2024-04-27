import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
console.log("Wallet Key ", process.env.Wallet_KEY);
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks:{
    base_sepolia:{
      url:"https://sepolia.base.org",
      accounts:[process.env.WALLET_KEY as string]
    }
  },
  etherscan:{
    apiKey:{
      baseSepolia:"W439QQVT2U8TH7X7I7UVNSK81Y5W2N6KWB"
    }
  }
};

export default config;
