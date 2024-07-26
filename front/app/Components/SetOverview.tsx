import React from 'react'
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { SetDetails } from '../Logic/ContractQueries'

const SetOverview = ({set}: {set: SetDetails}) => {
  return (
    <div className="flex flex-col w-72 h-96 gap-y-4">
      {set && <div>
        <div className='w-72 h-72 mb-2'>
          {set.images!.length > 1 ? (
            <div className='grid grid-cols-3 grid-rows-3'>
              {set!.images!.map((image, i) => (
                <img key={i} className={i === 0 ? 'col-span-2 row-span-2' : ''} src={image.URI.image} />
              ))}
            </div>
          ) : set.images && (
            <img src={set.images[0].URI.image} />
          )}
        </div>
        <div className='flex justify-between gap-4 text-xs'>
          <div className='flex gap-2'>
            {set.images!.length > 1 ? 'Print Edition' : 'Numbered Print'}
            {set.revealed && (
              <div className='text-blue-700 mt-[-3px]'>
                <RiVerifiedBadgeFill size={20} />
              </div>
            )}
          </div>
          <div>{set.votes}/{set.counts}</div>
        </div>
        <div className='flex justify-between gap-4 text-xs text-slate-500'>
          <div>8x8</div>
          <div className='truncate'>{set.name}</div>
        </div>
      </div>}
    </div>  
  )
}

export default SetOverview