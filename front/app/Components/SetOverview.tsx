import React from 'react'
import { SetDetails } from '../Logic/ContractQueries'
import AddressViewer from './AddressViewer'

const SetOverview = (props:{set:SetDetails}) => {
  return (
    <div className="flex flex-col h-80 w-80 bg-slate-300 gap-y-6 p-4">
      <div className='flex flex-auto max-w-80 max-h-80'>
          {props.set.images && <img className='h-48 w-48' src = {props.set.images[0].URI.image}></img>}

          {props.set.images && props.set.images!.map((image,index)=>(
              index!=0 &&
              <img className=' min-h-20 min-w-20' src = {image.URI.image} width={20} height={20}></img>
          ))}
      </div>
      <a className=" text-xs">{props.set.name}</a>
      <div className="grow flex items-end">
        <AddressViewer address={props.set.owner}></AddressViewer>
      </div>
    </div>  
  )
}

export default SetOverview