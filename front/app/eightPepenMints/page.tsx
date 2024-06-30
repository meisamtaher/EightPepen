'use client'
import React, { useEffect, useState } from 'react'
import { EightPepenContractAddress, EightPepenFCContractAddress } from '../Constants/Contracts';
import { EightPepenNFTABI } from "../ABIs/EightPepenNFTABI"
import { useAccount, useWriteContract,  } from 'wagmi';
import { parseEther } from 'viem';
import { getTotalSupply,getMaxSupply, getMintPrice } from '../Logic/ContractQueries';


const EightPepenMint = () => {
    const { writeContract } = useWriteContract()
    const [totalSuply,setTotalSupply] = useState<number|undefined>(undefined);
    const [maxSupply,setMaxSupply] = useState<number|undefined>(undefined);
    const [mintPrice,setMintPrice] = useState<number|undefined>(undefined);
    const mintEightPepen = async()=>{
        const result = writeContract({
            address: EightPepenFCContractAddress,
            abi: EightPepenNFTABI,
            functionName: 'mint',
            args: [
            ],
            value: parseEther('0.00003') 
         })
         console.log("result: ", result);
    }
    const getSupply = async()=>{
      setTotalSupply(await getTotalSupply());
      setMaxSupply(await getMaxSupply())
      setMintPrice(await getMintPrice());
    }
    useEffect(() => {
      getSupply();
    }, []);
  return (
    <div className='flex flex-col gap-5  pt-20 p-x-2'>
        <a>
Mint an unrevealed 8pepen token to become a collector. 
</a>
<a> With your unrevealed token you can start opting in to a set you like.
When enough collectors are interested in the artwork, the metadata of your token will change to your opt-in artwork.
</a>
<a>We start with a first-come first-serve principal</a>
<div className='flex felx-row  gap-4'><a>mint Price: </a><a className='text-lg font-extrabold'> {mintPrice} Eth</a></div>
<div className='flex flex-row '> {totalSuply}/{maxSupply}</div>



        <button className='p-12 text-4xl bg-black w-64 text-white' onClick={mintEightPepen}> Mint</button>
    </div>
  )
}

export default EightPepenMint