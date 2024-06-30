'use client'
import React, { useEffect, useState } from 'react'
import { getUnrevealedImages,Image } from '../Logic/ContractQueries';
import Loader from '../Components/Loader'
import { getVotingTokensOfOwner, refreshNFTmetadata } from '../Logic/TokenQueries';
import { useAccount, useWriteContract } from 'wagmi';
import { EightPepenFCContractAddress } from '../Constants/Contracts';
import { EightPepenFCNFTABI } from '../ABIs/EightPepenFCNFTABI';

const Submissions = () => {
    const account = useAccount();
    const [loading, setLoading] = useState<boolean>(true);
    const [images,setImages] = useState<Image[]>([]);
    const { writeContract } = useWriteContract()

    const getImages = async ()=>{
        const images = await getUnrevealedImages()
        setImages(images);
        setLoading(false);
    }
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
        getImages();
    }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex flex-wrap gap-12'>
        {images.map(image =>(
          <div key={image.id} className='flex flex-col  justify-center'>
            <div  className='flex flex-col w-[180px] h-[240px] gap-1 justify-self-center'>
                <img src={image.URI.image} width={150} height={150}></img>  
                <a className='w-[150px] text-wrap text-xs'>name: {image.URI.name}</a>
                <a className='w-[150px] text-wrap text-xs mt-2'>opt-ins: {image.votes}/{image.counts}</a>
            </div>
              <button  className=" p-1 w-24 justify-self-center text-white text-xs bg-black" onClick={()=>opt_in(image.id)}>opt-in </button>
          </div>
        ))}
    </div>
  )
}

export default Submissions