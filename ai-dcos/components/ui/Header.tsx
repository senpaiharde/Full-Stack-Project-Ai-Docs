import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import { Button } from '../button';
import { FilePlus2 } from 'lucide-react';
import UpgradeButton from './UpgradeButton';
import { ModeToggle } from '../ModeToggle';

function Header() {
  return (
    <div className="flex justify-between bg-white dark:bg-zinc-900 shadow-sm p-5 border-b dark:border-zinc-800">
      <Link href="/dashboard" className="text-2xl">
        Chart to <span className="text-indigo-600">PDF</span>
      </Link>
      <SignedIn>
        <div className="flex items-center space-x-2">
         <ModeToggle />
          <Button asChild variant="link" className="hidden md:flex">
            <Link href="/dashboard/upgrade">Pricing</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard">My Documents</Link>
          </Button>
          <Button asChild variant="outline" className="text-indigo-600">
            <Link href="/dashboard/upload">
              <FilePlus2 className="text-indigo-600" />
            </Link>
          </Button>
          <UpgradeButton />
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
}

export default Header;
