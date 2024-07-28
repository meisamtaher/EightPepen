'use client'
import { useState } from 'react';
import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { getSetDetails, SetDetails } from '@/app/Logic/ContractQueries';
import Loader from '../../Components/Loader'
import React, { useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi';
import { getVotingTokensOfOwner } from '@/app/Logic/TokenQueries';
import { EightPepenFCContractAddress } from '@/app/Constants/Contracts';
import { EightPepenFCNFTABI } from '@/app/ABIs/EightPepenFCNFTABI';
import AddressViewer from '@/app/Components/AddressViewer';

const SetDetailsPage = ({ params }: { params: { setId: string } }) => {
  const { writeContract } = useWriteContract();
  const account = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [setDetails, setSetDetails] = useState<SetDetails| undefined>(undefined);

  const loadSetDetails = async () => {
    setLoading(true);
    const setDetails = await getSetDetails(Number(params.setId));
    console.log("Set Details: ", setDetails);
    setSetDetails(setDetails);
    setLoading(false);
  };
  const opt_in =  async(imageId:number)=>{
    console.log('Hello');
    if(account.isConnected){
      const voting_tokens = await getVotingTokensOfOwner(account.address!);
      if(voting_tokens.length>0){
        const hash = await writeContract({
          address: EightPepenFCContractAddress,
          abi: EightPepenFCNFTABI,
          functionName: 'opt_in',
          args: [BigInt(imageId),BigInt(voting_tokens[0].tokenId)]
        })
      }
    }
  }

  useEffect(() => {
    loadSetDetails();
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex flex-col'>
      {setDetails && <div>
        <div className='flex flex-row'>
          <div className='mb-2'>
            <div className='text-base '>{setDetails.name}</div>
            <div className='text-xxs  mt-2'>{setDetails.description}</div>
          </div>
          <div className='ml-20'>
            <AddressViewer address={setDetails.owner}></AddressViewer>
          </div>
        </div>
        <div className='mb-8 border-t-4 border-black' />
        <div className='flex gap-16 text-xxs mb-24'>
          <div className='flex flex-col gap-2'>SET<div>{setDetails!.id}</div></div>
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
          <div key={i} className='mt-16'>
            {image.counts} Editions
            <div className='my-4 border-t-4 border-black' />
            <div className='flex flex-wrap gap-4'>
              <img className="row-span-4" width={300} height={300} src={image.URI.image} />
              <div className=" justify-start align-bottom">
                <button disabled={image.counts==image.votes} className={" mb-4 w-24  p-2 h-fit align-bottom text-white text-xxs " + (image.counts==image.votes ? 'bg-gray-400' : 'bg-black') } onClick={()=>opt_in(image.id)}>opt-in </button>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  )
}

export default SetDetailsPage