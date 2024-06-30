import { rejects } from "assert";
import { EightPepenFCNFTABI } from "../ABIs/EightPepenFCNFTABI";
import { EightPepenFCContractAddress } from "../Constants/Contracts";
import { publicClient } from "../Util/client";
import { Address, parseAbiItem } from "viem";
import { alchemy } from "../Util/alchemy";
import { Utils } from "alchemy-sdk";
import { } from "wagmi";

export interface Set{
    id: number,
    name:string,
    description:string,
    owner: Address,
}
export const getTotalSupply= async():Promise<number>=>{
  const totalSupply = new Promise<number>(async(resolve,reject)=>{
    const totalSupply = await publicClient.readContract({
      address: EightPepenFCContractAddress,
      abi: EightPepenFCNFTABI,
      functionName: 'totalSupply',
    })
    resolve(Number(totalSupply))
  })
  return totalSupply;
}
export const getMaxSupply= async():Promise<number>=>{
  const maxSupply = new Promise<number>(async(resolve,reject)=>{
    const maxSupply = await publicClient.readContract({
      address: EightPepenFCContractAddress,
      abi: EightPepenFCNFTABI,
      functionName: 'maxSupply',
    })
    resolve(Number(maxSupply))
  })
  return maxSupply;
}
export const getMintPrice= async():Promise<number>=>{
  const mintPrice = new Promise<number>(async(resolve,reject)=>{
    const mintPrice = await publicClient.readContract({
      address: EightPepenFCContractAddress,
      abi: EightPepenFCNFTABI,
      functionName: 'mintPrice',
    })
    resolve(Number(mintPrice)/1e18)
  })
  return mintPrice;
}
export const getSubmissionSets = async():Promise<Set[]>=>{
    const sets = new Promise<Set[]>(async(resolve,reject)=>{
          const totalSets = await publicClient.readContract({
              address: EightPepenFCContractAddress,
              abi: EightPepenFCNFTABI,
              functionName: 'setSupply',
            })
          const EightPepenInterface = new Utils.Interface(EightPepenFCNFTABI);
          const AddSetEvent = EightPepenInterface.encodeFilterTopics('AddSet', []);
          console.log("FIlter: ", AddSetEvent)
          const logs = await alchemy.core.getLogs({
            fromBlock: '0x0',
            toBlock: 'latest',
            address: EightPepenFCContractAddress,
            topics: AddSetEvent,
          });
          const parsedLogs = logs.map(log=> {
            return EightPepenInterface.parseLog(log)
          })
          let tempSets:Set[]=[];
          for( let i=1;i<=totalSets;i++){ 
            console.log("get URI:",i);
      
            const SetDetails = await publicClient.readContract({
              address: EightPepenFCContractAddress,
              abi: EightPepenFCNFTABI,
              functionName: 'sets',
              args:[BigInt(i)]
            })
            let temp:Set = {id:i,name:SetDetails[0],description:SetDetails[1],owner:'0x0'};
            if(parsedLogs[i-1] && parsedLogs[i-1].args[0]== BigInt(i)){
              temp.owner = parsedLogs[i-1].args[1];
            }
            tempSets.push(temp);
          }
        resolve(tempSets);
    })
    return sets;
}
interface SetDetails{
    id: number,
    name:string,
    description:string,
    images:Image[]
}
export interface Image{
    id: number,
    votes: number, 
    counts: number,
    revealed: boolean,
    setId:number,
    URI: {
        name: string,
        description: string,
        image: string
    }
}
export const getSetDetails = async(id:number):Promise<SetDetails>=>{
    const sets = new Promise<SetDetails>(async(resolve,reject)=>{
          const logs = await publicClient.getLogs({  
            address: EightPepenFCContractAddress,
            event: parseAbiItem('event AddImage(uint256 indexed _id,uint256 indexed _setId, uint16, address artist)'),
            args:{
                _setId:BigInt(id)
            }
          })
          console.log("Images:", logs);
          let tempSets:SetDetails={} as SetDetails;
        resolve(tempSets);
    })
    return sets;
}
export const getImages = async():Promise<Image[]>=>{
    const images = new Promise<Image[]>(async(resolve,reject)=>{
        const totalSupply = await publicClient.readContract({
          address: EightPepenFCContractAddress,
          abi: EightPepenFCNFTABI,
          functionName: 'imageSupply',
        })
        let tempImages:Image[]=[];
        for( let i=1;i<=totalSupply;i++){ 
          console.log("get URI:",i);
          const imageJsonURI = await publicClient.readContract({
            address: EightPepenFCContractAddress,
            abi: EightPepenFCNFTABI,
            functionName: 'imageURI',
            args:[BigInt(i),BigInt(i)]
          })
          const imageDetails = await publicClient.readContract({
            address: EightPepenFCContractAddress,
            abi: EightPepenFCNFTABI,
            functionName: 'images',
            args:[BigInt(i)]
          })
          const votes  = await publicClient.readContract({
            address: EightPepenFCContractAddress,
            abi: EightPepenFCNFTABI,
            functionName: 'votes',
            args:[BigInt(i)]
          })
          const json = atob(imageJsonURI.substring(29));
          const imageJson = JSON.parse(json);
          imageJson.id = i;
          imageJson.votes = votes;
          imageJson.counts = imageDetails[3]; //counts
          imageJson.revealed = imageDetails[2];//revealed
          imageJson.setId = imageDetails[1];

          tempImages.push(imageJson);
        }
        // setNFTs(tempNFTs);
        resolve(tempImages);
    })
    return images;
}
export const getUnrevealedImages = async():Promise<Image[]>=>{
    const images = new Promise<Image[]>(async(resolve,reject)=>{
        const totalSupply = await publicClient.readContract({
          address: EightPepenFCContractAddress,
          abi: EightPepenFCNFTABI,
          functionName: 'imageSupply',
        })
        let tempImages:Image[]=[];
        for( let i=2;i<=totalSupply;i++){ 
          console.log("get URI:",i);

          const imageDetails = await publicClient.readContract({
            address: EightPepenFCContractAddress,
            abi: EightPepenFCNFTABI,
            functionName: 'images',
            args:[BigInt(i)]
          })
          if(!imageDetails[2]){
            const imageJsonURI = await publicClient.readContract({
                address: EightPepenFCContractAddress,
                abi: EightPepenFCNFTABI,
                functionName: 'imageURI',
                args:[BigInt(i),BigInt(i)]
              })
              const votes  = await publicClient.readContract({
                address: EightPepenFCContractAddress,
                abi: EightPepenFCNFTABI,
                functionName: 'votes',
                args:[BigInt(i)]
              })
              const json = atob(imageJsonURI.substring(29));
              const imageJson = JSON.parse(json);
              let image:Image ={} as Image;
              image.URI = imageJson;
              image.id = i;
              image.votes = votes;
              image.counts = imageDetails[3]; //counts
              image.revealed = imageDetails[2];//revealed
              image.setId = Number(imageDetails[1]);
              tempImages.push(image);
          }

        }
        resolve(tempImages);
    })
    return images;
}