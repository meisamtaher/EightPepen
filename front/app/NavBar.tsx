'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from  "@/public/logo.png"
import { BlackCreateWalletButton } from './Components/BlackCreateWalletButton';
import { useAccount } from 'wagmi';

const NavBar = () => {
  const account = useAccount();
  const links = [
    {href:"/eightPepenMints",label:"Mint"},
    {href:"/create",label:"Create"},
    {href:"/submissions",label:"Submissions"},
    {href:"/sets",label:"sets"},
  ]
  useEffect(() => {
    console.log("account: ", account)
  }, [account]);
  return (
    <nav className='flex space-x-6 px-5 shrink-0 h-16 items-center bg-slate-950'  >
        <div className='flex flex-row items-center mr-16'>
          <Link href={"/"} className="text-white text-lg"> 8Pepen</Link>
        </div>
        <ul className='flex space-x-6'>
            {links.map(link=>
            <div className='flex items-center bg-white px-3 py-2' key={link.label}>
              <Link className="text-sm" href={link.href} >{link.label}</Link>
            </div> 
            )}
        </ul>
        <div className='flex flex-row-reverse w-full items-center gap-2'>
         {!account.isConnected && <BlackCreateWalletButton></BlackCreateWalletButton>}
          <ConnectButton ></ConnectButton>
        </div>
        
        
    </nav>
  )
}

export default NavBar