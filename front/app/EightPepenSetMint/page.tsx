'use client'
import React, { useState } from 'react'
import { EightPepenSetContractAddress } from '../Constants/Contracts'
import { EightPepenSetNFTABI } from "../ABIs/EightPepenSetNFTABI"
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'


const EightPepenSetMint = () => {
  const { writeContract } = useWriteContract()
  const [pixelColors,setPixelColors] = useState<string|null>(null);
  const [colorPalette,setColorPalette] = useState<string|null>(null);

    //   const { data:ReserveData ,write:ReserveWrite } = useContractWrite(ReserveConfig);
    //   const { isLoading:isLoadingReserve, isSuccess:isSuccessReserve } = useWaitForTransaction({
    //     hash: ReserveData?.hash,
    //   })
    const PixelColors = 0x1211117890123456781111345622221234343490121111319012345678901230n;
    const ColorPallet = 0x1234567890123456789012FFFFFF901234FFFFFF474AE2FE000000FF037E5757n;
    const mintEightPepen = async()=>{
        const result = writeContract({
            address: EightPepenSetContractAddress,
            abi: EightPepenSetNFTABI,
            functionName: 'mint',
            args: [PixelColors,ColorPallet
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

export default EightPepenSetMint