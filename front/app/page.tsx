'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { Address, parseAbiItem, zeroAddress } from "viem";
import {EightPepenFCSetContractAddress} from "./Constants/Contracts"
import { publicClient } from './Utils/client'
import { EightPepenFCSetNFTABI } from './ABIs/EightPepenFCSetNFTABI'
import AddressViewer from "./Components/AddressViewer";
 


interface NFT{
  id: number,
  name:string,
  description:string,
  image:string,
  address:string
}
export default function Home() {
  const [NFTs,setNFTs] = useState<NFT[]>();
  const getNFTlist = async()=>{
    const totalSupply = await publicClient.readContract({
      address: EightPepenFCSetContractAddress,
      abi: EightPepenFCSetNFTABI,
      functionName: 'totalSupply',
    })
    console.log("total Supply:", totalSupply);
    const logs = await publicClient.getLogs({  
      address: EightPepenFCSetContractAddress,
      event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
    })
    console.log("Mint logs:", logs)
    let tempNFTs:NFT[]=[];
    for( let i=1;i<=totalSupply;i++){ 
      console.log("get URI:",i);

      const tokenJsonURI = await publicClient.readContract({
        address: EightPepenFCSetContractAddress,
        abi: EightPepenFCSetNFTABI,
        functionName: 'tokenURI',
        args:[BigInt(i)]
      })
      const Address = await publicClient.readContract({
        address: EightPepenFCSetContractAddress,
        abi: EightPepenFCSetNFTABI,
        functionName: 'ownerOf',
        args:[BigInt(i)]
      })
      const json = atob(tokenJsonURI.substring(29));
      const result = JSON.parse(json);
      console.log("NFT:",result);
      console.log("Owner:", Address);
      result.address = Address;
      result.id = i;
      tempNFTs.push(result);
      console.log("NFTs: ", NFTs);
    }
    setNFTs(tempNFTs);
  }
  useEffect(() => {
    getNFTlist();
  }, []);
  return (
    <main className="flex min-h-screen flex-col  gap-8 p-10">
      <a>Latest Mints</a>
      <div className=" w-full h-1 bg-black" ></div>
      <div className="flex flex-wrap  gap-x-8 gap-y-12">
        
          {
          NFTs?.map(nft=>
            (<div key={nft.id}>
            <img src={nft.image} width={150} height={150}></img>
            <a className=" text-xs">1x</a>
            <AddressViewer address={nft.address}></AddressViewer>
            </div>
          )
          )
          }
      </div>
    </main>
  );
}