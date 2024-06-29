'use client'
import { getTokenDetails, NFT } from '@/app/Logic/TokenQueries'
import React, { useState } from 'react'

const TokenPage = ({ params }: { params: { tokenId: string } }) => {
  const [nft,setNft] = useState<NFT>();
  getTokenDetails(Number(params.tokenId)).then(x=>{
    setNft(x);
  })
  return (
    <div>
        {nft && 
            <div className='w-[150px] h-[250px] flex flex-col g-1'>
                
                <img src={nft!.image} width={150} height={150}></img>  
                <a className='w-[150px] text-wrap text-xs mt-2'>name: {nft!.name}</a>
            </div>
        }
    </div>
  )
}

export default TokenPage