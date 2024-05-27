'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { EightPepenSetContractAddress } from '../Constants/Contracts'
import { EightPepenSetNFTABI } from "../ABIs/EightPepenSetNFTABI"
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import Canvas from '../Components/Canvas'
import { ImagePixelated } from '../Components/ImagePixelated'


const EightPepenSetMint = () => {
  const { writeContract } = useWriteContract()
  const [pixelColors,setPixelColors] = useState<string|null>(null);
  const [colorPalette,setColorPalette] = useState<string|null>(null);
  const [file, setFile] = useState<File|null>(null);
  const [fileURL, setFileURL] = useState<string|null>(null);
  const pixelationFactor = 8;
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.files){
      setFile(e?.target?.files[0]);
      setFileURL(URL.createObjectURL(e?.target?.files[0]));
    }
  };
  const create8PepenImage = async(input:File) =>{
    // pixelateImage(originalImage1, 8);
    console.log("Hey we are at the end of Pixelation")
  }
  // // const pixelatedImage = document.querySelector("#pixelatedImage") as HTMLImageElement;
  // function pixelateImage(originalImage: HTMLImageElement, pixelationFactor: number) {
    
  // }
    //   const { data:ReserveData ,write:ReserveWrite } = useContractWrite(ReserveConfig);
    //   const { isLoading:isLoadingReserve, isSuccess:isSuccessReserve } = useWaitForTransaction({
    //     hash: ReserveData?.hash,
    //   })
    // const PixelColors = 0x1211117890123456781111345622221234343490121111319012345678901230n;
    // const ColorPallet = 0x1234567890123456789012FFFFFF901234FFFFFF474AE2FE000000FF037E5757n;
    const mintEightPepen = async()=>{
        // const result = writeContract({
        //     address: EightPepenSetContractAddress,
        //     abi: EightPepenSetNFTABI,
        //     functionName: 'mint',
        //     args: [PixelColors,ColorPallet
        //     ],
        //     value: parseEther('0.00003') 
        //  })
        //  console.log("result: ", result);
    }
    // useEffect(() => {
    //   if(true){
    //     const originalImage = document.querySelector("#originalImage") as HTMLImageElement;
    //     const canvas = document.createElement("canvas");
    //     const context = canvas.getContext("2d");
    //     const originalWidth = originalImage.width;
    //     const originalHeight = originalImage.height;
    //     const canvasWidth = originalWidth;
    //     const canvasHeight = originalHeight;
    //     canvas.width = canvasWidth;
    //     canvas.height = canvasHeight;
    //     console.log("image width:", originalWidth)
    //     console.log("image height:", originalHeight)
    //     context?.drawImage(originalImage, 0, 0, originalWidth, originalHeight);
    //     const originalImageData = context?.getImageData(
    //       0,
    //       0,
    //       originalWidth,
    //       originalHeight
    //     ).data;
    //     if ( originalImageData && context) {
    //       for (let y = 0; y < originalHeight; y += pixelationFactor) {
    //         for (let x = 0; x < originalWidth; x += pixelationFactor) {
    //           // extracting the position of the sample pixel
    //           const pixelIndexPosition = (x + y * originalWidth) * 4;
    //           // drawing a square replacing the current pixels
    //           context.fillStyle = `rgba(
    //             ${originalImageData[pixelIndexPosition]},
    //             ${originalImageData[pixelIndexPosition + 1]},
    //             ${originalImageData[pixelIndexPosition + 2]},
    //             ${originalImageData[pixelIndexPosition + 3]}
    //           )`;
    //           context.fillRect(x, y, pixelationFactor, pixelationFactor);
    //         }
    //       }
    //     }
    //     pixelatedImage.src = canvas.toDataURL();
    //   }        
    // }, []);
  return (
    <div className='flex flex-col gap-5 justify-center pt-60'>
        <button className='p-2' onClick={mintEightPepen}> Mint</button>
        <button>

        </button>
        <input type='file' accept='.png,.jpg,.jpeg,.svg' onChange={onFileChange}/>
        <div className='flex felx-row gap-5 p-2'>
          <div className = 'w-48 h-48 bg-black' >
            <img id="originalImage" src={fileURL!} ></img>
          </div>
          <div>

          </div>
          <div className = 'w-48 h-48'>
           <ImagePixelated src={fileURL!} width ={240} height={240} centered={false} fillTransparencyColor="true" fillBackgroundColor='rgb(0,0,0)'  pixelSize={30}></ImagePixelated>
          </div>
        </div>
        
    </div>
  )
}

export default EightPepenSetMint