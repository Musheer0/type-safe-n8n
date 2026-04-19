import { TRPCReactProvider } from '@/trpc/client';
import { ClerkProvider } from '@clerk/nextjs'

import React from 'react';
import { Toaster } from 'sonner';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
 <ClerkProvider>
       <TRPCReactProvider>
        <Toaster/>
        {children}
    </TRPCReactProvider>
 </ClerkProvider>
  );
};

export default Layout;