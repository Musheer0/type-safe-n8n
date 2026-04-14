import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
   <header className='w-full h-auto'>
    <nav className='w-full flex items-center justify-between gap-2 px-3 py-3 border-b'> 
        <div className="branding flex items-center justify-center gap-3">
            <Image
            src={'/logo.svg'}
            width={30}
            height={30}
            alt='logo'
            />
            <p className='text-xl font-bold'>n8n.ts</p>
        </div>

        <div className="right">
            <UserButton/>
        </div>
    </nav>
       </header>
  )
}

export default Navbar