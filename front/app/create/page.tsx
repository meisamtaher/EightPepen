// @ts-nocheck
'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { EightPepenFCRenderer, EightPepenFCContractAddress, EightPepenFCCircularRenderer } from '../Constants/Contracts'
import { EightPepenFCNFTABI } from "../ABIs/EightPepenFCNFTABI"
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import UploadImage from '../Components/UploadImage'
import Loader from '../Components/Loader'
import { ColorPicker, useColor, ColorService } from 'react-color-palette'
import "react-color-palette/css";


const copyCountArray = [1, 4, 5, 10, 20, 40]

const EightPepenSetMint = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [renderer, setRenderer] = useState<string>('default')
  const [editionType, setEditionType] = useState<string>('numbered')
  const [colorPixels, setColorPixels] = useState<string[]>(Array(6).fill(''))
  const bgColors = Array(6).fill().map(() => useColor('#121212')) // eslint-disable-line
  const fistUploadRef = useRef()
  const [setName, setSetName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { writeContract } = useWriteContract()
  const mintEightPepen = async () => {
    let colors = editionType === 'numbered'
      ? [[colorPixels[0], bgColors[0][0]]]
      : colorPixels.map((colorPixels, i) => [colorPixels, bgColors[i][0]])
    setLoading(true)
    const hash = await writeContract({
      address: EightPepenFCContractAddress,
      abi: EightPepenFCNFTABI,
      functionName: 'submitSet',
      args: [
        colors.map(([pixels, bgColor], i) => {
          let secondhalf = BigInt('0x' + pixels.slice(0, 60))
          let firsthalf = BigInt('0x' + pixels.slice(60, 120))
          let bigIntBgColor = Number('0x' + bgColor.hex.slice(1, 7))
          return {
            pixelColors: [firsthalf, secondhalf],
            bgColor: bigIntBgColor,
            setId: BigInt(0),
            revealed: false,
            count: editionType === 'numbered' ? 1 : copyCountArray[i]
          }
        }), {
          name: setName,
          description,
          renderer: renderer === 'circular' ? EightPepenFCCircularRenderer : EightPepenFCRenderer,
          hasRenderer: renderer !== 'default'
        }
      ]
    })
    // const transaction = await publicClient.waitForTransactionReceipt({ hash })
    // if (transaction.status === 'success')
    //   router.push('/submissions')
    // else {
    //   setLoading(false)
    //   updateEditionType('numbered')
    // }
    router.push('/submissions')
  }
  const updateEditionType = type => {
    setEditionType(type)
    fistUploadRef.current?.reset()
    setColorPixels(Array(6).fill(''))
    bgColors.forEach(([_, set]) => set(ColorService.convert('hex', '#121212')))
  }

  if (loading) {
    return <Loader />
  }

  const canSubmit = colorPixels.some(Boolean) && setName && description

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center'>
        <div className='mr-8 text-2xl'>Edition Type:</div>
        <select className='p-4 text-xs' value={editionType} onChange={e => updateEditionType(e.target.value)}>
          <option value='numbered'>Numbered Print</option>
          <option value='print'>Print Edition</option>
        </select>
      </div>
      {(editionType === 'print' ? copyCountArray : [1]).map((copies, i) => (
        <div key={i} className='mt-4 mb-4'>
          <div className='mb-16 border-t-4 border-black' />
          <dialog id={'bg-color-modal-' + i} className="modal">
            <div className="modal-box bg">
              <ColorPicker color={bgColors[i][0]} onChange={bgColors[i][1]} /> 
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <div className='mb-4 text-xl'>{copies + (copies === 1 ? ' Copy' : ' Copies')}</div>
          <div className='flex items-center'>
            <div className='w-56 text-xs'>Background Color:</div>
            <button className="btn h-4 w-12 text-xs" style={{background: bgColors[i][0].hex}} onClick={() => document?.getElementById('bg-color-modal-' + i).showModal()} />
          </div>
          <UploadImage index={i} ref={i === 0 ? fistUploadRef : undefined} bgColor={bgColors[i][0].hex} defaultFillColor='#D9D9D9' onChange={p => {setColorPixels([...colorPixels.slice(0, i), p, ...colorPixels.slice(i + 1)])}} />
        </div>
      ))}
      <div className='my-16 border-t-4 border-black' />
      <div className='mb-8 text-2xl'>
        Set Data
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52 text-xs'>Set Name:</div>
        <input className='p-3' value={setName} onChange={e => setSetName(e.target.value)} />
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52 text-xs'>Description:</div>
        <input className='p-3' value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52 text-xs'>Renderer:</div>
        <select className='p-4 text-xs' value={renderer} onChange={e => setRenderer(e.target.value)}>
          <option value='default'>Default</option>
          <option value='circular'>Circular</option>
        </select>
      </div>
      <div className='mt-8 flex gap-4'>
        <button className='p-4 w-64 text-black bg-white' onClick={() => updateEditionType('numbered')}>Cancel</button>
        <button className={'p-4 w-64 text-white ' + (canSubmit ? 'bg-black' : 'bg-gray-400')} disabled={!canSubmit} onClick={mintEightPepen}>Mint</button>
      </div>
    </div>
  )
}

export default EightPepenSetMint