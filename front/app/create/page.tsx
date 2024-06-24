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
  const [multiPixelColors, setMultiPixelColors] = useState<string[]>(Array(6).fill(''));
  const [editionType, setEditionType] = useState<string>('numbered');
  const [artistName, setArtistName] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
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
        <select className='p-4' value={editionType} onChange={e => setEditionType(e.target.value)}>
          <option value='numbered'>Numbered Print</option>
          <option value='print'>Print Edition</option>
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
      {editionType === 'print' ? [1, 4, 5, 10, 20, 40].map((copies, i) => (
        <div key={i} className='mt-16 mb-6'>
          <div className='mb-4'>{copies} Copies</div>
          <UploadImage bgColor={bgColor.hex} defaultFillColor='#D9D9D9' onChange={p => {setMultiPixelColors([...multiPixelColors.slice(0, i), p, ...multiPixelColors.slice(i + 1)])}} />
          <div className='mt-16 border-t-4 border-black' />
        </div>
      )) : (
        <div className='mt-16 mb-6'>
          <UploadImage ref={uploadRef} bgColor={bgColor.hex} defaultFillColor='#D9D9D9' onChange={setPixelColors} />
          <div className='mt-16 border-t-4 border-black' />
        </div>
      )}
      <div className='mb-8 text-2xl'>
        Collection Data
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52'>Artist Name:</div>
        <input className='p-3' value={artistName} onChange={e => setArtistName(e.target.value)} />
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52'>Collection Name:</div>
        <input className='p-3' value={collectionName} onChange={e => setCollectionName(e.target.value)} />
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52'>Description:</div>
        <input className='p-3' value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      {(editionType === 'numbered' ? pixelColors : multiPixelColors.some(Boolean)) && (
        <div className='mt-8 flex gap-4'>
          <button className='p-4 w-64 bg-white text-black' onClick={() => { setEditionType('numbered'); uploadRef.current?.reset() }}>Cancel</button>
          <button className='p-4 w-64 bg-black text-white' onClick={mintEightPepen}>Mint</button>
        </div>
      )}
    </div>
  )
}

export default EightPepenSetMint