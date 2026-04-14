import DashboardHeader from '@/features/dashboard/components/dashboard-header';
import BottomNav from '@/features/dashboard/components/dashboard-mobile-header';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <DashboardHeader/>
    {children}
    <BottomNav/>
    </>
  );
};

export default Layout;