import { EightPepenFCNFTABI } from "../ABIs/EightPepenFCNFTABI"
import { EightPepenFCContractAddress } from "../Constants/Contracts"
import { publicClient } from "../Util/client"

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
        const totalSupply = await publicClient.readContract({
          address: EightPepenFCContractAddress,
          abi: EightPepenFCNFTABI,
          functionName: 'totalSupply',
        })
        let tempNFTs:NFT[]=[];
        for( let i=1;i<=totalSupply;i++){ 
          console.log("get URI:",i);

          const tokenURI = await publicClient.readContract({
            address: EightPepenFCContractAddress,
            abi: EightPepenFCNFTABI,
            functionName: 'tokenURI',
            args:[BigInt(i)]
          })
          const json = atob(tokenURI.substring(29));
          const result = JSON.parse(json);
          result.id = i;
          tempNFTs.push(result);
        }
        resolve(tempNFTs);
    })
    return nfts;
}