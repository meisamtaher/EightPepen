'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { EightPepenFCSetContractAddress } from '../Constants/Contracts'
import { EightPepenFCSetNFTABI } from "../ABIs/EightPepenFCSetNFTABI"
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { ImagePixelated } from '../Components/ImagePixelated'
import Crop from '../Components/Crop'
import { ColorPicker, useColor } from 'react-color-palette'
import "react-color-palette/css";

const EightPepenSetMint = () => {
  const { writeContract } = useWriteContract()
  const [pixelColors,setPixelColors] = useState<string|null>(null);
  const [colorPalette,setColorPalette] = useState<string|null>(null);
  const [fileURL, setFileURL] = useState<string|null>(null);
  const [croppedURL, setCroppedURL] = useState<string|null>(null);
  const [bgColor,setBgColor] = useColor("#121212");
  const pixelationFactor = 8;
    //   const { data:ReserveData ,write:ReserveWrite } = useContractWrite(ReserveConfig);
    //   const { isLoading:isLoadingReserve, isSuccess:isSuccessReserve } = useWaitForTransaction({
    //     hash: ReserveData?.hash,
    //   })
    // const PixelColors = 0x1211117890123456781111345622221234343490121111319012345678901230n;
    // const ColorPallet = 0x1234567890123456789012FFFFFF901234FFFFFF474AE2FE000000FF037E5757n;
    const mintEightPepen = async()=>{
        if(pixelColors){
          const secondhalf =BigInt("0x"+ pixelColors.slice(0,60));
          const firsthalf =BigInt("0x" +pixelColors.slice(60,120));
          const bigIntBgColor = Number("0x" + bgColor.hex.slice(1,7));
          console.log("Background: ",bigIntBgColor.toString(16));
          console.log("first half:", firsthalf.toString(16))
          console.log("second half:", secondhalf.toString(16));
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
    useEffect(() => {
      console.log("pixelColors: ",pixelColors)
    }, [pixelColors]);


  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: ([file]) => setFileURL(URL.createObjectURL(file)),
  });

  return (
    <div className='flex flex-col px-14 py-10 bg-[#D9D9D9] mt-[-20px] min-h-[calc(100vh-56px)]'>
      <input {...getInputProps()} accept='.png,.jpg,.jpeg,.svg' />
      <div className='flex items-center gap-4'>
        <a>Background Color:</a>
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
      {fileURL ? <>
        <div className='my-16 flex gap-16 grow'>
          <div className='flex flex-col gap-4 w-[240px]'>
            <img id="originalImage" src={fileURL!} />
            Original image
            <div className='cursor-pointer bg-[#828282] text-white p-2' onClick={() => setFileURL(null)}>Choose another image</div>
          </div>
          <Crop imgSrc={fileURL!} onChange={setCroppedURL} cropWidth={120} cropHeight={120} />
          <div className='w-[240px] h-[240px]'>
            <ImagePixelated src={croppedURL!} width={240} height={240} setColorPalette={setColorPalette} setPixelColor={setPixelColors} centered={false} fillTransparencyColor="true" fillBackgroundColor={bgColor.hex} pixelSize={30}></ImagePixelated>
          </div>
        </div>
        <button className='p-2' onClick={mintEightPepen}>Mint</button>
      </> : (
        <div {...getRootProps()} className='cursor-pointer my-16 flex items-center w-[240px] h-[240px] bg-[#F5F5F5] font-light text-center text-xs text-[#828282]'>
          Click to upload or drag & drop
        </div>
      )}
    </div>
  )
}

export default EightPepenSetMint