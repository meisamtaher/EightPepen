'use client'
import { getSetDetails } from '@/app/Logic/ContractQueries';
import React, { useEffect } from 'react'

const SetDetails = ({ params }: { params: { setId: string } }) => {
  useEffect(() => {
    const setDetails = getSetDetails(Number(params.setId));
    setDetails.then((x)=>{
      console.log("SetDetails:", x);
    })
  }, []);
  return (
    <div>SetDetails</div>
  )
}

export default SetDetails