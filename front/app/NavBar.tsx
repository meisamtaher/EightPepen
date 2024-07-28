'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from  "@/public/logo.png"
import { BlackCreateWalletButton } from './Components/BlackCreateWalletButton';
import { useAccount } from 'wagmi';
import { FaBars, FaX } from 'react-icons/fa6'

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e: any) => {
      if (!(ref.current as any).contains(e.target))
        setOpen(false)
    }
    addEventListener('click', handler)
    return () => removeEventListener('click', handler)
  }, []);
  const pathname = usePathname();
  const account = useAccount();
  const links = [
    {href:"/eightPepenMints",label:"Mint"},
    {href:"/create",label:"Create"},
    // {href:"/submissions",label:"Submissions"},
    {href:"/sets",label:"sets"},
  ]
  return <>
    <nav className='max-[1095px]:hidden flex space-x-6 px-5 shrink-0 h-16 items-center bg-slate-950 overflow-hidden'>
        <div className='flex flex-row items-center mr-4'>
          <Link href={"/"} className="text-white text-base"> 8Pepen</Link>
        </div>
        <ul className='flex space-x-6'>
            {links.map(link=>
            <div className={`flex items-center px-3 py-2 ${link.href === pathname ? 'bg-blue-800' : 'bg-white'}`} key={link.label}>
              <Link className={'text-xs ' + (link.href === pathname ? 'text-white' : '')} href={link.href} >{link.label}</Link>
            </div> 
            )}
        </ul>
        <div className='flex flex-row-reverse w-full items-center gap-2'>
         {!account.isConnected && <BlackCreateWalletButton></BlackCreateWalletButton>}
          <ConnectButton ></ConnectButton>
        </div>
    </nav>
    <nav ref={ref} className='min-[1096px]:hidden h-16 bg-slate-950'>
      <div className='h-full px-4 flex items-center justify-between'>
        <Link href='/' className='text-white text-base'>8Pepen</Link>
        <div className='text-white cursor-pointer' onClick={() => setOpen(!open)}>
          <FaBars size={30} className={`transition ${open ? 'opacity-0' : ''}`} />
          <FaX size={30} className={`mt-[-30px] transition ${!open ? 'opacity-0' : ''}`} />
        </div>
      </div>
      <div className={`flex flex-col gap-3 px-4 py-8 bg-slate-950 invisible opacity-0 hamburgerMenu ${open ? 'hamburgerMenuOpen' : ''}`}>
        {links.map(link=>
          <Link className={`flex items-center px-3 py-2 ${link.href === pathname ? 'bg-blue-800' : 'bg-white'}`} key={link.label}  href={link.href}>
            <div className={'text-xxs ' + (link.href === pathname ? 'text-white' : '')}>{link.label}</div>
          </Link> 
        )}
        <div className='py-2 flex flex-row-reverse items-center gap-2 text-xs'>
         {!account.isConnected && <BlackCreateWalletButton></BlackCreateWalletButton>}
          <ConnectButton  ></ConnectButton>
        </div>
      </div>
    </nav>
  </>
}

export default NavBar