'use client'
import Loader from '@/app/Components/Loader';
import { getTokenDetails, NFT, refreshNFTmetadata } from '@/app/Logic/TokenQueries'
import { Nft } from 'alchemy-sdk';
import React, { useEffect, useState } from 'react'
import { FaArrowsRotate } from "react-icons/fa6";
import openseaLogo from "@/public/opensea.png"
import Image from 'next/image'
import Link from 'next/link';
import { BaseOpenseaLink } from '@/app/Constants/Contracts';

const TokenPage = ({ params }: { params: { tokenId: string } }) => {
  const [nft,setNft] = useState<Nft>();
  const [loading,setLoading] = useState(false);
  const refresh = async ()=>{
    setLoading(true);
    await refreshNFTmetadata(params.tokenId);
    setLoading(false);
  }
  useEffect(() => {
    getTokenDetails(Number(params.tokenId)).then(x=>{
      setNft(x);
      console.log("NFT:", x);
    })

  }, []);

  return (
    <div>
        {nft && 
          <div className='flex flex-wrap'>

            <div className='w-[300px] h-[300px] flex flex-col g-1'>
                <img src={nft.raw.metadata.image} width={300} height={300}></img> 
                <Link href={BaseOpenseaLink + nft.tokenId} target='_blank' rel='noopener noreferrer'>

                    <Image src={openseaLogo} alt="Opensea link" className='w-5 h-5 ml-2 mt-2 hover:bg-black rounded-full'/>
                      
                </Link>

            </div>
            <div className='flex flex-col gap-6 pt-8 pl-10'>
              <div className='flex flex-col gap-1'>
                <a className='text-xxs'>SET </a>
                <a className='text-xxs'>{nft!.name}</a>
              </div>
              <div className='flex flex-col gap-1'>
                <a className='text-xxs'>DESCRIPTION </a>
                <a className='text-xxs'>{nft!.description}</a>
              </div>
              <a className=' text-wrap text-xxs mt-2'></a>
              <div className='flex flex-auto gap-8'>
                {nft!.raw!.metadata!.attributes!.map((attribute: { trait_type: string , value: string },index:number)=>(
                  <div key={index} className='flex flex-col gap-1'>
                    <a className='text-xxs'>{attribute.trait_type}</a>
                    <a className='text-xxs'>{attribute.value}</a>
                  </div>
                ))}
              </div>
            </div>
            {loading && <Loader></Loader>}
            {!loading && <button  className="flex flex-row-reverse" onClick={()=>refresh()}>
              <FaArrowsRotate/>
            </button>}
          </div>

          
        }
    </div>
  )
}

export default TokenPage