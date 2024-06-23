'use client'
import React, { useState, useRef } from 'react'
import { EightPepenFCSetContractAddress } from '../Constants/Contracts'
import { EightPepenFCSetNFTABI } from "../ABIs/EightPepenFCSetNFTABI"
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import UploadImage from '../Components/UploadImage'
import { ColorPicker, useColor } from 'react-color-palette'
import "react-color-palette/css";

const EightPepenSetMint = () => {
  const [pixelColors,setPixelColors] = useState<string|null>(null);
  const uploadRef = useRef()
  const { writeContract } = useWriteContract()
  const [bgColor,setBgColor] = useColor("#121212");

    const mintEightPepen = async()=>{
        if(pixelColors){
          const secondhalf =BigInt("0x"+ pixelColors.slice(0,60));
          const firsthalf =BigInt("0x" +pixelColors.slice(60,120));
          const bigIntBgColor = Number("0x" + bgColor.hex.slice(1,7));
          const result = await writeContract({
              address: EightPepenFCSetContractAddress,
              abi: EightPepenFCSetNFTABI,
              functionName: 'mint',
              args: [[firsthalf,secondhalf],bigIntBgColor
              ],
              value: parseEther('0.00003') 
          })
          console.log("result: ", result);
        }        
    }

  return (
    <div className='flex flex-col gap-4 px-14 py-10 bg-[#D9D9D9] mt-[-20px] min-h-[calc(100vh-56px)]'>
      <div className='flex items-center'>
        <div className='w-72'>Edition Type:</div>
        <select className='p-4'>
          <option>Numbered Print</option>
          <option>Print Edition</option>
        </select>
      </div>
      <div className='flex items-center'>
        <div className='w-72'>Background Color:</div>
        <button className="btn h-4 w-12" style={{background:bgColor.hex}} onClick={()=>((document?.getElementById('my_modal_2') as HTMLDialogElement).showModal())}></button>
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box bg">
          <ColorPicker color={bgColor} onChange={setBgColor} /> 
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <UploadImage ref={uploadRef} bgColor={bgColor.hex} defaultFillColor='#D9D9D9' onChange={setPixelColors} />
      {pixelColors && (
        <div className='flex gap-4'>
          <button className='p-4 w-64 bg-white text-black' onClick={() => uploadRef.current.reset()}>Cancel</button>
          <button className='p-4 w-64 bg-black text-white' onClick={mintEightPepen}>Mint</button>
        </div>
      )}
    </div>
  )
}

export default EightPepenSetMint