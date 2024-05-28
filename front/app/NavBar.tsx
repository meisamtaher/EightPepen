import Link from 'next/link'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from  "@/public/logo.png"

const NavBar = () => {
  const links = [
    {href:"eightPepenMints",label:"Vote token"},
    {href:"create",label:"Create"},
  ]
  return (
    <nav className='flex space-x-6 mb-5 px-5 h-14 items-center bg-slate-950' >
        <div className='flex flex-row items-center space-x-2'>
          <img src="/logo.png" className='w-9 h-9'/>
          <Link href={"/"} className="text-white text-lg"> 8Pepen</Link>
        </div>
        <ul className='flex space-x-6'>
            {links.map(link=>
            <div className='flex flex-row space-x-1 items-center border border-gray-700 border-r-2 p-2' key={link.label}>
              {/* <img src={link.img}/> */}
              <Link className="text-white text-sm transition-colors" href={link.href} >{link.label}</Link>
            </div> 
            )}
        </ul>
        <div className = "bg-white"><ConnectButton ></ConnectButton></div>
        
    </nav>
  )
}

export default NavBar