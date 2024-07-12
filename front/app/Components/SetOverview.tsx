import React from 'react'
import { SetDetails } from '../Logic/SetQueries'

const SetOverview = (props:{set:SetDetails}) => {
  return (
    <div className='flex flex-auto max-w-80 max-h-80'>
        {props.set.images && props.set.images!.map(image=>(
            <img src = {image.URI.image} width={20} height={20}></img>
        ))}
    </div>
  )
}

export default SetOverview