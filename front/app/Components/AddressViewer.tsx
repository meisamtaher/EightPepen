import React from 'react'

const AddressViewer = (props:{address:string}) => {
    console.log("Address:",props.address)
    return (
      <div className='text-xs text-slate-500'>{(props.address!.length > 20)?props.address.slice(0,4)+"..."+props.address.slice(-4): props.address}</div>
    )
}
  
export default AddressViewer