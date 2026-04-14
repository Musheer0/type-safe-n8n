import Navbar from '@/features/dashboard/components/navbar';
import { TRPCReactProvider } from '@/trpc/client';
import { ClerkProvider } from '@clerk/nextjs'

import React from 'react';
import { Toaster } from 'sonner';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
 <ClerkProvider>
       <TRPCReactProvider>
        <Navbar/>
        <Toaster/>
        {children}
    </TRPCReactProvider>
 </ClerkProvider>
  );
};

export default Layout;