import { rejects } from "assert";
import { EightPepenFCNFTABI } from "../ABIs/EightPepenFCNFTABI";
import { EightPepenFCContractAddress } from "../Constants/Contracts";
import { publicClient } from "../Util/client";
import { Address, parseAbiItem } from "viem";
import { alchemy } from "../Util/alchemy";
import { batch } from "../Util/batch";
import { Utils } from "alchemy-sdk";
import { } from "wagmi";
import setsJson from "./setsWithDetail.json";
const MockSets:SetDetails[] = setsJson as unknown as SetDetails[];
export const PAGE_SIZE = 10;
export interface Set{
    id: number,
    name:string,
    description:string,
    votes: number,
    counts: number,
    revealed: boolean,
    setNumber: number,
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
          let batchFns = []
          for( let i=1;i<=totalSets;i++){ 
            batchFns.push(async () => {
              console.log("get URI:",i);
              const SetDetails = await publicClient.readContract({
                address: EightPepenFCContractAddress,
                abi: EightPepenFCNFTABI,
                functionName: 'sets',
                args:[BigInt(i)]
              })
              let temp:Set
              if(i%5){
                temp = {id:i,name:SetDetails[0],description:SetDetails[1],owner:'0x0123',counts:80,votes:0,revealed:false,setNumber:0};
              }
              else{
                temp = {id:i,name:SetDetails[0],description:SetDetails[1],owner:'0x0123',counts:80,votes:80,revealed:true,setNumber:i/5+1};

              }
              if(parsedLogs[i-1] && parsedLogs[i-1].args[0]== BigInt(i)){
                temp.owner = parsedLogs[i-1].args[1];
              }
              tempSets.push(temp);
            })
          }
          await batch(batchFns)
        resolve(tempSets);
    })
    return sets;
}
export interface SetDetails{
    id: number,
    name: string,
    description: string,
    owner: Address,
    counts: number,
    votes: number,
    revealed:boolean
    setNumber: number,
    images: undefined|Image[]
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
export const getSetDetails = async(id:number):Promise<SetDetails|undefined>=>{
  return MockSets.find(set=>(set.id==id));
  // const EightPepenInterface = new Utils.Interface(EightPepenFCNFTABI);
  // const AddImageEvent = EightPepenInterface.encodeFilterTopics('AddImage', []);
  // console.log("FIlter: ", AddImageEvent)
  // const logs = await alchemy.core.getLogs({
  //   fromBlock: '0x0',
  //   toBlock: 'latest',
  //   address: EightPepenFCContractAddress,
  //   topics: AddImageEvent,
  // });
  // const parsedLogs = logs.map(log=> {
  //   return EightPepenInterface.parseLog(log)
  // })
  // console.log("Logs:", parsedLogs);
  // // const logs = await publicClient.getLogs({  
  // //   address: EightPepenFCContractAddress,
  // //   event: parseAbiItem('event AddImage(uint256 indexed _id,uint256 indexed _setId, uint16, address artist)'),
  // //   args:{
  // //       _setId:BigInt(id)
  // //   }
  // // })
  // console.log("Images:", parsedLogs);
  // let tempSets:SetDetails={} as SetDetails;
  // return tempSets;
}
export const getImages = async():Promise<Image[]>=>{
  const totalSupply = await publicClient.readContract({
    address: EightPepenFCContractAddress,
    abi: EightPepenFCNFTABI,
    functionName: 'imageSupply',
  })
  let tempImages:Image[]=[];
  let batchFns = []
  for( let i=1;i<=totalSupply;i++){ 
    batchFns.push(async () => {
      
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
      let image:Image ={} as Image;
      image.URI = imageJson;
      image.id = i;
      image.votes = votes;
      image.counts = imageDetails[3]; //counts
      image.revealed = imageDetails[2];//revealed
      image.setId = Number(imageDetails[1]);
      tempImages.push(image);
    })
  }
  await batch(batchFns,10,false);
  return tempImages;
}
export const getUnrevealedImages = async():Promise<Image[]>=>{
    const images = new Promise<Image[]>(async(resolve,reject)=>{
        const totalSupply = await publicClient.readContract({
          address: EightPepenFCContractAddress,
          abi: EightPepenFCNFTABI,
          functionName: 'imageSupply',
        })
        let batchFns = []
        let tempImages:Image[]=[];
        for( let i=2;i<=totalSupply;i++){
          batchFns.push(async () => {
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
            console.log("get URI:",i);
          })
        }
        await batch(batchFns,10,false)
        resolve(tempImages);
    })
    return images;
}
export const getSetsWithDetails = async():Promise<SetDetails[]>=>{
  const sets = await getSubmissionSets();
  const images  = await getImages();
  const groupedImages = groupBy<Image>(images,"setId");
  console.log("Grouped Images:", groupedImages);
  const setsWithDetails = sets.map(x=>{
    (x as SetDetails).images = groupedImages[x.id]
    return x as SetDetails
  })
  console.log(setsWithDetails);
  //@ts-ignore
  return setsWithDetails;
}
export const getSetsPageWithDetails = async(page:number):Promise<SetDetails[]>=>{
  let start = page*PAGE_SIZE;
  let end = (page+1)*PAGE_SIZE
  if(start>MockSets.length){
    start = MockSets.length;
  }
  if(end>MockSets.length){
    end = MockSets.length;
  }
  let setsWithDetails:SetDetails[] = MockSets.slice(start,end);
  return setsWithDetails ;
}
const groupBy = function<TItem>(xs: TItem[], key: string) : {[key: string]: TItem[]}{
  return xs.reduce(function(rv, x) {
    //@ts-ignore
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
