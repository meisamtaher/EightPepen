// @ts-nocheck
'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { EightPepenFCRenderer, EightPepenFCContractAddress, EightPepenFCCircularRenderer, EightPepenFCOpepenRenderer } from '../Constants/Contracts'
import { EightPepenFCNFTABI } from "../ABIs/EightPepenFCNFTABI"
import { useAccount, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import ColorPicker from '../Components/ColorPicker'
import UploadImage from '../Components/UploadImage'
import Loader from '../Components/Loader'
import { useColor, ColorService } from 'react-color-palette'
import "react-color-palette/css";


const copyCountArray = [1, 4, 5, 10, 20, 40]

const EightPepenSetMint = () => {
  const router = useRouter()
  const account = useAccount();
  const [loading, setLoading] = useState<boolean>(false)
  const [renderer, setRenderer] = useState<string>('default')
  const [editionCount, setEditionCount] = useState<string>('8')
  const [editionType, setEditionType] = useState<string>('numbered')
  const [colorPixels, setColorPixels] = useState<string[]>(Array(6).fill(''))
  const bgColors = Array(6).fill().map(() => useColor('#121212')) // eslint-disable-line
  const penColors = Array(6).fill().map(() => useColor('#f00')) // eslint-disable-line
  const [picking, setPicking] = useState({})
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
            count: editionType === 'numbered' ? editionCount : copyCountArray[i]
          }
        }), {
          name: setName,
          description,
          renderer: renderer === 'circular' ? EightPepenFCCircularRenderer :renderer === 'cool'? EightPepenFCOpepenRenderer: EightPepenFCRenderer,
          hasRenderer: renderer !== 'default',
          artist: account.address
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
    router.push('/sets')
  }
  const updateEditionType = type => {
    setEditionType(type)
    fistUploadRef.current?.reset()
    setColorPixels(Array(6).fill(''))
    bgColors.forEach(([_, set]) => set(ColorService.convert('hex', '#121212')))
    penColors.forEach(([_, set]) => set(ColorService.convert('hex', '#f00')))
  }

  const handlePickColor = color => {
    if (!picking.type)
      return
    (picking.type === 'bg' ? bgColors: penColors)[picking.i][1](ColorService.convert('hex', color));
    setPicking({})
  }

  if (loading) {
    return <Loader />
  }

  const canSubmit = colorPixels.some(Boolean) && setName && description

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center'>
        <div className='w-72 text-xxs'>Edition Type:</div>
        <select className='w-56 p-4 text-xxs' value={editionType} onChange={e => updateEditionType(e.target.value)}>
          <option value='numbered'>Numbered Print</option>
          <option value='print'>Print Edition</option>
        </select>
      </div>
      <div className='flex items-center'>
        <div className='w-72 text-xxs'>Renderer:</div>
        <select className='w-56 p-4 text-xxs' value={renderer} onChange={e => setRenderer(e.target.value)}>
          <option value='default'>Pixel</option>
          <option value='circular'>Circle</option>
          <option value='cool'>Original</option>
        </select>
      </div>
      {(editionType === 'print' ? copyCountArray : [1]).map((copies, i) => (
        <div key={i} className=''>
          <div className='mb-8 border-t-4 border-black' />
          <div className='mb-4 text-base'>{(editionType !='print'?editionCount:copies) + (copies === 1 ? ' Edition' : ' Edition')}</div>
          {(editionType != 'print') && 
            <div className='flex items-center mt-2 mb-8'>
              <div className='w-56 text-xxs'>Edition: </div>
              <select className='p-4 text-xxs' value={editionCount} onChange={e => setEditionCount(e.target.value)}>
                <option value='8'>8</option>
                <option value='16'>16</option>
                <option value='24'>24</option>
                <option value='32'>32</option>
              </select>
            </div>}
          <ColorPicker
            title='Background Color'
            color={bgColors[i][0]}
            onChange={bgColors[i][1]}
            isPicking={picking.i === i && picking.type === 'bg'}
            onPick={isPicking => setPicking(isPicking ? { i, type: 'bg' } : {})}
          />
          <div className='mt-2' />
          <ColorPicker
            title='Pen Color'
            color={penColors[i][0]}
            onChange={penColors[i][1]}
            isPicking={picking.i === i && picking.type === 'pen'}
            onPick={isPicking => setPicking(isPicking ? { i, type: 'pen' } : {})}
          />
          <div className='mt-12' />
          <UploadImage
            ref={i === 0 ? fistUploadRef : undefined}
            defaultFillColor='#D9D9D9'
            bgColor={bgColors[i][0].hex}
            penColor={penColors[i][0].hex}
            isPicking={picking.type}
            onPick={handlePickColor}
            renderer={renderer}
            onChange={p => {setColorPixels([...colorPixels.slice(0, i), p, ...colorPixels.slice(i + 1)])}}
          />
        </div>
      ))}
      <div className=' border-t-4 border-black' />
      <div className='my-8 text-base'>
        Set Data
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52 text-xxs'>Set Name:</div>
        <input className='p-3' value={setName} onChange={e => setSetName(e.target.value)} />
      </div>
      <div className='flex items-center'>
        <div className='my-4 w-52 text-xxs'>Description:</div>
        <input className='p-3' value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className='mt-8 flex gap-4'>
        <button className='p-4 w-36 text-black bg-white text-xxs ' onClick={() => updateEditionType('numbered')}>Cancel</button>
        <button className={'p-4 w-36 text-white text-xxs ' + (canSubmit ? 'bg-black' : 'bg-gray-400')} disabled={!canSubmit} onClick={mintEightPepen}>Submit</button>
      </div>
    </div>
  )
}

export default EightPepenSetMint