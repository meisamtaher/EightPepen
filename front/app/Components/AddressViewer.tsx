import React from 'react'

const AddressViewer = (props:{address:string}) => {
    return (
      <div className='text-xxs text-slate-500'>{(props.address!.length > 20)?props.address.slice(0,4)+"..."+props.address.slice(-4): props.address}</div>
    )
}
  
export default AddressViewer