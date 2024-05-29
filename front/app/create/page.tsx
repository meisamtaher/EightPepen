'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { EightPepenFCSetContractAddress } from '../Constants/Contracts'
import { EightPepenFCSetNFTABI } from "../ABIs/EightPepenFCSetNFTABI"
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
// import Canvas from '../Components/Canvas'
import { ImagePixelated } from '../Components/ImagePixelated'
import { ColorPicker, useColor } from 'react-color-palette'
import "react-color-palette/css";

const EightPepenSetMint = () => {
  const { writeContract } = useWriteContract()
  const [pixelColors,setPixelColors] = useState<string|null>(null);
  const [colorPalette,setColorPalette] = useState<string|null>(null);
  const [file, setFile] = useState<File|null>(null);
  const [fileURL, setFileURL] = useState<string|null>(null);
  const [bgColor,setBgColor] = useColor("#121212");
  const pixelationFactor = 8;
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.files){
      setFile(e?.target?.files[0]);
      setFileURL(URL.createObjectURL(e?.target?.files[0]));
    }
  };
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
    useEffect(() => {
      console.log("pixelColors: ",pixelColors)
    }, [pixelColors]);
  return (
    <div className='flex flex-col gap-5 justify-center'>
        <input type='file' accept='.png,.jpg,.jpeg,.svg' onChange={onFileChange}/>
        <div className='flex flex-row gap-4 items-center'>
          <a>Background Color:</a>
          <button className="btn h-4 w-12" style={{background:bgColor.hex}} onClick={()=>((document?.getElementById('my_modal_2') as HTMLDialogElement).showModal())}></button>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box bg">
              <ColorPicker   color={bgColor}  
                      onChange={setBgColor}   /> 
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
        <div className='flex felx-row gap-5 p-2 '>
          <div className = 'flex flex-col w-[240] h-[240]' >
            <a>uploaded Pic</a>
            <img id="originalImage" src={fileURL!} ></img>
          </div>
          <div >
          </div>
          <div className = 'w-48 h-48 '>
            <a>8pepen</a>
           <ImagePixelated src={fileURL!} width ={240} height={240} setColorPalette={setColorPalette} setPixelColor={setPixelColors} centered={false} fillTransparencyColor="true" fillBackgroundColor={bgColor.hex}  pixelSize={30}></ImagePixelated>
          </div>
        </div>
        <button className='p-2' onClick={mintEightPepen}> Mint</button>
    </div>
  )
}

export default EightPepenSetMint