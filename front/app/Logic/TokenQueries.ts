import { EightPepenFCNFTABI } from "../ABIs/EightPepenFCNFTABI"
import { EightPepenFCContractAddress } from "../Constants/Contracts"
import { publicClient } from "../Util/client"
import { alchemy } from "../Util/alchemy"
import { Address } from "viem"
import { BigNumber, Contract, Nft, OwnedNft } from "alchemy-sdk"
export interface NFT{
    id: number,
    name: string,
    description: string,
    image: string
    attributes:[
    ]
}
export const getTokenDetails = async(id:number):Promise<Nft>=>{
    const NFT = new Promise<Nft>(async(resolve,reject)=>{
        const metadata = await alchemy.nft.getNftMetadata(EightPepenFCContractAddress,id);
        resolve(metadata);
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
export const refreshNFTmetadata= (id:string) =>{
  return alchemy.nft.refreshNftMetadata(EightPepenFCContractAddress,id)
}
export const getVotingTokensOfOwner = async(address:Address):Promise<OwnedNft[]>=>{
    const nfts = new Promise<OwnedNft[]>(async(resolve,reject)=>{
        const response = await alchemy.nft.getNftsForOwner(address.toString(),{contractAddresses:[EightPepenFCContractAddress],tokenUriTimeoutInMs:0})
        let tempNFTs:OwnedNft[]=[];
        let unrevealed_nfts = response.ownedNfts.filter(nft=>(
           nft.raw.metadata.attributes[1]["value"] == "False"
        )
        )
        for(let i=0;i<unrevealed_nfts.length;i++){
          const tokens = await publicClient.readContract({
            address: EightPepenFCContractAddress,
            abi: EightPepenFCNFTABI,
            functionName: 'tokens',
            args:[BigInt(unrevealed_nfts[i].tokenId)]
          })
          console.log("tokens:", tokens)
          if(tokens[0] == BigInt(1)){
            tempNFTs.push(unrevealed_nfts[i]);
          }
        }
        resolve(tempNFTs);
    })
    return nfts;
}