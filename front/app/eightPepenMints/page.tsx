'use client'
import React from 'react'
import { EightPepenContractAddress } from '../Constants/Contracts';
import { EightPepenNFTABI } from "../ABIs/EightPepenNFTABI"
import { useAccount, useWriteContract,  } from 'wagmi';
import { parseEther } from 'viem';


const EightPepenMint = () => {
    const { writeContract } = useWriteContract()

    //   const { data:ReserveData ,write:ReserveWrite } = useContractWrite(ReserveConfig);
    //   const { isLoading:isLoadingReserve, isSuccess:isSuccessReserve } = useWaitForTransaction({
    //     hash: ReserveData?.hash,
    //   })
    const mintEightPepen = async()=>{
        const result = writeContract({
            address: EightPepenContractAddress,
            abi: EightPepenNFTABI,
            functionName: 'mint',
            args: [
            ],
            value: parseEther('0.00003') 
         })
         console.log("result: ", result);
    }
  return (
    <div className='flex flex-col gap-5 justify-center pt-60'>
        <button className='p-2' onClick={mintEightPepen}> Mint</button>
    </div>
  )
}

export default EightPepenMint