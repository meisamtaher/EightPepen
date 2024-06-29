'use client'
import React, { useEffect, useState } from 'react'
import { getTokens, getTokensOfOwner, NFT } from './Logic/TokenQueries';
import Link from 'next/link';
import { useAccount } from 'wagmi';

const MainPage = () => {
    const [NFTs, setNFTS] = useState<NFT[]>([]);
    const account = useAccount();
    useEffect(() => {
        getTokens().then((nfts)=>{
            setNFTS(nfts);
        })
        if(account.isConnected){
            getTokensOfOwner(account!.address!);
        }
    }, [account.address]);
  return (
    <div className='flex flex-wrap p-4 gap-8'>
        {NFTs.map(nft=>(
            <Link key={nft.id} href={`/token/${nft.id}`}>
                <button className='flex flex-col g-1'>
                    <img src={nft.image} width={150} height={150}></img>  
                    <a className=' text-xs'>name: {nft.name}</a>
                </button>
            </Link>
            
        ))}
    </div>
  )
}

export default MainPage