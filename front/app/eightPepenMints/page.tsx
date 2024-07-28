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
    <div className='flex flex-col gap-5  pt-4 p-x-2'>
      <a className=' text-base'>JOIN THE WEB3 REVOLUTION</a>
      <a className=' text-xxs'>
        Mint an unrevealed 8pepen token to become a collector & curator. 
      </a>
      <a className=' text-xxs'> With your unrevealed token you can start opting in to a sets of your choice and shape actively the 8pepen collection.</a>
      <a className=' text-xxs'> When enough collectors are interested in the set, a consensus is met and the metadata of your unrevealed token will change to the artwork you opted in.</a>
      <a className=' text-xxs'>We start with a first-come first-serve principal</a>
      <a className='mt-10 text-base' >8✖️8 Contract</a>
      <div className='border-t-4 border-black' />
      <div className='flex flex-wrap  gap-20 p-4'>
        <div className='flex flex-col gap-5'>
          <div className='flex felx-row  gap-4 text-xxs'><a> mint Price: </a><a className='text-xxs font-extrabold'> {mintPrice} Eth</a></div>
          <div className='flex flex-row text-xxs'> {totalSuply}/{maxSupply}</div>
        </div>
        <div className='grid flex-1 justify-items-center align-middle'>
          <button className='text-xxs bg-black  text-white p-2 h-fit' onClick={mintEightPepen}> Mint</button>
        </div>
      </div>
    </div>
  )
}

export default EightPepenMint