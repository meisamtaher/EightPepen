'use client'
import React, { useEffect, useState } from 'react'
import { getTokens, NFT } from './Logic/TokenQueries';
import Link from 'next/link';
import Loader from './Components/Loader'

const MainPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [NFTs, setNFTS] = useState<NFT[]>([]);
    useEffect(() => {
        getTokens().then((nfts)=>{
            setNFTS(nfts);
            setLoading(false);
        })
    }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex flex-wrap gap-6'>
        {NFTs.map(nft=>(
            <Link key={nft.id} href={`/token/${nft.id}`}>
                <div className='w-[150px] h-[250px] flex flex-col g-1'>
                    <img src={nft.image} width={150} height={150}></img>  
                    <a className='w-[150px] text-wrap text-xs mt-2'>name: {nft.name}</a>
                </div>
            </Link>
            
        ))}
    </div>
  )
}

export default MainPage