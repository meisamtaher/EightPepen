'use client'
import { useState } from 'react';
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { getSetDetails } from '@/app/Logic/ContractQueries';
import Loader from '../../Components/Loader'
import React, { useEffect } from 'react'

const SetDetails = ({ params }: { params: { setId: string } }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [setDetails, setSetDetails] = useState<boolean>(false);

  const loadSetDetails = async () => {
    setLoading(true);
    const setDetails = await getSetDetails(Number(params.setId));
    setSetDetails(setDetails);
    setLoading(false);
  };

  useEffect(() => {
    loadSetDetails();
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex flex-col'>
      <div className='text-xl mb-2'>{setDetails.name}</div>
      <div className='text-xs mb-4'>{setDetails.description}</div>
      <div className='mb-8 border-t-4 border-black' />
      <div className='flex gap-16 text-xs mb-24'>
        <div className='flex flex-col gap-2'>SET<div>{setDetails.id}</div></div>
        {setDetails.revealed && (
          <div className='flex flex-col gap-2'>
            CONSENSUS
            <div className='text-blue-700 mt-[-3px]'>
              <RiVerifiedBadgeFill size={20} />
            </div>
          </div>
        )}
      </div>
      {setDetails.images?.map((image, i) => (
        <div className='mt-16'>
          {image.counts} Editions
          <div className='my-4 border-t-4 border-black' />
          <img width={300} height={300} src={image.URI.image} />
        </div>
      ))}
    </div>
  )
}

export default SetDetails