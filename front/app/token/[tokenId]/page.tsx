'use client'
import Loader from '@/app/Components/Loader';
import { getTokenDetails, NFT, refreshNFTmetadata } from '@/app/Logic/TokenQueries'
import { Nft } from 'alchemy-sdk';
import React, { useEffect, useState } from 'react'
import { FaArrowsRotate } from "react-icons/fa6";

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
    })

  }, []);

  return (
    <div>
        {nft && 
          <div className='flex flex-row'>

            <div className='w-[150px] h-[250px] flex flex-col g-1'>
                <img src={nft.raw.metadata.image} width={150} height={150}></img>  
                <a className='w-[150px] text-wrap text-xs mt-2'>name: {nft!.name}</a>
                
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