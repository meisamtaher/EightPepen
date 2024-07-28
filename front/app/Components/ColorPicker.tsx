// @ts-nocheck
import React, { useMemo, useRef } from 'react'
import { ColorPicker as CP } from 'react-color-palette'
import { FaEyeDropper } from 'react-icons/fa6'

let ColorPicker = ({ title, color, onChange, isPicking, onPick }) => {
  let ref = useRef()

  return (
    <div className='flex items-center'>
      <dialog ref={ref} className='modal'>
        <div className='modal-box'>
          <CP color={color} onChange={onChange} /> 
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button />
        </form>
      </dialog>
      <div className='w-56 text-xxs'>{title}:</div>
      <button
        className='btn h-4 w-12 text-xxs'
        style={{ background: color.hex }}
        onClick={() => ref.current.showModal()}
      />
      <div
        className={'ml-6 cursor-pointer ' + (isPicking ? 'text-blue-700' : '')}
        onClick={() => onPick(!isPicking)}
      >
        <FaEyeDropper size={20} />
      </div>
    </div>
  )
}

export default ColorPicker
