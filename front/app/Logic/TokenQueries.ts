import { EightPepenFCNFTABI } from "../ABIs/EightPepenFCNFTABI"
import { EightPepenFCContractAddress } from "../Constants/Contracts"
import { publicClient } from "../Util/client"
import { alchemy } from "../Util/alchemy"
import { Address } from "viem"
export interface NFT{
    id: number,
    name: string,
    description: string,
    image: string
    attributes:[
    ]
}
export const getTokenDetails = async(id:number):Promise<NFT>=>{
    const NFT = new Promise<NFT>(async(resolve,reject)=>{
        const tokenURI = await publicClient.readContract({
            address: EightPepenFCContractAddress,
            abi: EightPepenFCNFTABI,
            functionName: 'tokenURI',
            args:[BigInt(id)]
          })
          const json = atob(tokenURI.substring(29));
          const result = JSON.parse(json);
          result.id = id;
        resolve(result);
    })
    return NFT;
}
export const getTokens = async():Promise<NFT[]>=>{
    const nfts = new Promise<NFT[]>(async(resolve,reject)=>{
        const response = await alchemy.nft.getNftsForContract(EightPepenFCContractAddress, {
        });
        console.log("response: ", response);
        let tempNFTs:NFT[]=[];
        for( let i=0;i<response.nfts.length;i++){ 
          let nft:NFT = {} as NFT;
          nft.id = Number(response.nfts[i].tokenId);
          nft.name = response.nfts[i].name!;
          nft.description = response.nfts[i].description!;
          nft.image = response.nfts[i].image.originalUrl!;
          tempNFTs.push(nft);
        }
        resolve(tempNFTs);
        // const totalSupply = await publicClient.readContract({
        //   address: EightPepenFCContractAddress,
        //   abi: EightPepenFCNFTABI,
        //   functionName: 'totalSupply',
        // })
        // let tempNFTs:NFT[]=[];
        // for( let i=1;i<=totalSupply;i++){ 
        //   console.log("get URI:",i);

        //   const tokenURI = await publicClient.readContract({
        //     address: EightPepenFCContractAddress,
        //     abi: EightPepenFCNFTABI,
        //     functionName: 'tokenURI',
        //     args:[BigInt(i)]
        //   })
        //   const json = atob(tokenURI.substring(29));
        //   const result = JSON.parse(json);
        //   result.id = i;
        //   tempNFTs.push(result);
        // }
        // resolve(tempNFTs);
    })
    return nfts;
}
export const getTokensOfOwner = async(address:Address):Promise<NFT[]>=>{
    const nfts = new Promise<NFT[]>(async(resolve,reject)=>{
        const response = await alchemy.nft.getNftsForOwner(address.toString(),{contractAddresses:[EightPepenFCContractAddress]})
        console.log("response for all NFTS: ", response);
        let tempNFTs:NFT[]=[];
        // for( let i=0;i<response.nfts.length;i++){ 
        //   let nft:NFT = {} as NFT; 
        //   nft.id = Number(response.nfts[i].tokenId);
        //   nft.name = response.nfts[i].name!;
        //   nft.description = response.nfts[i].description!;
        //   nft.image = response.nfts[i].image.originalUrl!;
        //   tempNFTs.push(nft);
        // }
        resolve(tempNFTs);
        // const totalSupply = await publicClient.readContract({
        //   address: EightPepenFCContractAddress,
        //   abi: EightPepenFCNFTABI,
        //   functionName: 'totalSupply',
        // })
        // let tempNFTs:NFT[]=[];
        // for( let i=1;i<=totalSupply;i++){ 
        //   console.log("get URI:",i);

        //   const tokenURI = await publicClient.readContract({
        //     address: EightPepenFCContractAddress,
        //     abi: EightPepenFCNFTABI,
        //     functionName: 'tokenURI',
        //     args:[BigInt(i)]
        //   })
        //   const json = atob(tokenURI.substring(29));
        //   const result = JSON.parse(json);
        //   result.id = i;
        //   tempNFTs.push(result);
        // }
        // resolve(tempNFTs);
    })
    return nfts;
}