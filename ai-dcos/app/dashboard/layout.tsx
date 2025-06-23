import Header from '@/components/ui/Header';
import { ClerkLoaded } from '@clerk/nextjs';
import React from 'react';

function DashBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkLoaded>
        <Header/>
      <div>{children}</div>
    </ClerkLoaded>
  );
}

export default DashBoardLayout;
