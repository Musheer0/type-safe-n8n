import { TRPCReactProvider } from '@/trpc/client';
import { ClerkProvider } from '@clerk/nextjs'

import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
 <ClerkProvider>
       <TRPCReactProvider>
        {children}
    </TRPCReactProvider>
 </ClerkProvider>
  );
};

export default Layout;