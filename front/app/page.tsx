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
                <div className='w-[150px] h-[250px] flex flex-col gap-2'>
                    <img src={nft.image} width={150} height={150}></img>  
                    <div className='flex flex-row'>
                        <a className='w-[150px] text-wrap text-xxs'>8✖️8</a>
                        <div className='flex flex-1 flex-row-reverse'>
                            <a className=' text-wrap text-xxs '>#{nft.id}</a>
                        </div>
                    </div>
                </div>
            </Link>
            
        ))}
    </div>
  )
}

export default MainPage