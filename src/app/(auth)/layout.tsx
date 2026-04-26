import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
   <ClerkProvider>
     <main className='w-full min-h-screen flex flex-col items-center justify-center'>
        {children}
    </main>
   </ClerkProvider>
  );
};

export default Layout;