import Link from 'next/link'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NavBar = () => {
  const links = [
    {href:"EightPepenMint",label:"Random Mint"},
    {href:"Manual",label:"Manual Mint"},
  ]
  return (
    <nav className='flex space-x-6 mb-5 px-5 h-14 items-center bg-slate-950' >
        <div className='flex flex-row items-center space-x-2'>
          {/* <img src={koala.src} className='w-9 h-9'/> */}
          <a href={"/"} className="text-white text-lg"> EightPepen</a>
        </div>
        <ul className='flex space-x-6'>
            {links.map(link=>
            <div className='flex flex-row space-x-1 items-center' key={link.label}>
              {/* <img src={link.img}/> */}
              <a className="text-white text-sm transition-colors" href={link.href} >{link.label}</a>
            </div> 
            )}
        </ul>
        <div className = "bg-white"><ConnectButton ></ConnectButton></div>
        
    </nav>
  )
}

export default NavBar