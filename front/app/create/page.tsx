// @ts-nocheck
'use client'
import React, { useState, useRef } from 'react'
import { EightPepenFCRenderer, EightPepenFCContractAddress } from '../Constants/Contracts'
import { EightPepenFCNFTABI } from "../ABIs/EightPepenFCNFTABI"
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import UploadImage from '../Components/UploadImage'
import { ColorPicker, useColor, ColorService } from 'react-color-palette'
import "react-color-palette/css";

const EightPepenSetMint = () => {
  const [editionType, setEditionType] = useState<string>('numbered')
  const [colorPixels, setColorPixels] = useState<string[]>(Array(6).fill(''))
  const bgColors = Array(6).fill().map(() => useColor('#121212'))
  const fistUploadRef = useRef()
  const [setName, setSetName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { writeContract } = useWriteContract()
  const mintEightPepen = async () => {
    let colors = editionType === 'numbered'
      ? [colorPixels[0], bgColors[0][0]]
      : colorPixels.map((colorPixels, i) => [colorPixels, bgColors[i][0]])
    await writeContract({
      address: EightPepenFCContractAddress,
      abi: EightPepenFCNFTABI,
      functionName: 'submitSet',
      args: [
        colors.map(([pixels, bgColor]) => {
          let secondhalf = BigInt('0x' + pixels.slice(0, 60))
          let firsthalf = BigInt('0x' + pixels.slice(60, 120))
          let bigIntBgColor = Number('0x' + bgColor.hex.slice(1, 7))
          return {
            pixelColors: [firsthalf, secondhalf],
            bgColor: bigIntBgColor,
            setId: BigInt(0),
            revealed: false,
            count: 80
          }
        }), {
          name: setName,
          description,
          renderer: EightPepenFCRenderer,
          hasRenderer: false
        }
      ]
    })
  }
  const updateEditionType = type => {
    setEditionType(type)
    fistUploadRef.current?.reset()
    setColorPixels(Array(6).fill(''))
    bgColors.forEach(([_, set]) => set(ColorService.convert('hex', '#121212')))
  }

  const canSubmit = setName && description

  return (
    <div className='flex flex-col gap-4 px-14 py-10 bg-[#D9D9D9] mt-[-20px] min-h-[calc(100vh-56px)]'>
      <div className='flex items-center'>
        <div className='w-72'>Edition Type:</div>
        <select className='p-4' value={editionType} onChange={e => updateEditionType(e.target.value)}>
          <option value='numbered'>Numbered Print</option>
          <option value='print'>Print Edition</option>
        </select>
      </div>
      {(editionType === 'print' ? [1, 4, 5, 10, 20, 40] : [1]).map((copies, i) => (
        <div key={i} className='mt-16 mb-6'>
          <dialog id={'bg-color-modal-' + i} className="modal">
            <div className="modal-box bg">
              <ColorPicker color={bgColors[i][0]} onChange={bgColors[i][1]} /> 
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <div className='mb-4'>{copies + (copies === 1 ? ' Copy' : ' Copies')}</div>
          <div className='flex items-center'>
            <div className='w-72'>Background Color:</div>
            <button className="btn h-4 w-12" style={{background: bgColors[i][0].hex}} onClick={() => document?.getElementById('bg-color-modal-' + i).showModal()} />
          </div>
          <UploadImage index={i} ref={i === 0 ? fistUploadRef : undefined} bgColor={bgColors[i][0].hex} defaultFillColor='#D9D9D9' onChange={p => {setColorPixels([...colorPixels.slice(0, i), p, ...colorPixels.slice(i + 1)])}} />
          <div className='mt-16 border-t-4 border-black' />
        </div>
      ))}
      <div className='mb-8 text-2xl'>
        Set Data
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52'>Set Name:</div>
        <input className='p-3' value={setName} onChange={e => setSetName(e.target.value)} />
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52'>Description:</div>
        <input className='p-3' value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      {colorPixels.some(Boolean) && (
        <div className='mt-8 flex gap-4'>
          <button className='p-4 w-64 text-black bg-white' onClick={() => updateEditionType('numbered')}>Cancel</button>
          <button className={'p-4 w-64 text-white ' + (canSubmit ? 'bg-black' : 'bg-gray-400')} disabled={!canSubmit} onClick={mintEightPepen}>Mint</button>
        </div>
      )}
    </div>
  )
}

export default EightPepenSetMint