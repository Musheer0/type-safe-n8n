import DashboardHeader from '@/features/dashboard/components/dashboard-header';
import BottomNav from '@/features/dashboard/components/dashboard-mobile-header';
import Navbar from '@/features/dashboard/components/navbar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <Navbar/>
    <DashboardHeader/>
    {children}
    <BottomNav/>
    </>
  );
};

export default Layout;