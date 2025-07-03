'use client';

import useSubscription from '@/hooks/helperSubscription';
import { Button } from '../button';
import Link from 'next/link';
import { Loader2Icon, StarIcon } from 'lucide-react';
import { createStripePortal } from '@/actions/createStripePortal';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import React from 'react';

function UpgradeButton() {
  const [isPending, startTransition] = useTransition(); /// cool feac is pending + makes the site active for user file there is pending in action
  const { hasActiveMembership, loading } = useSubscription();
  const router = useRouter()
  const handleAccount = () => {
    startTransition(async () => {
        const stripePortalUrl = await createStripePortal();
        router.push(stripePortalUrl)
        
        
    })
  }
  if (!hasActiveMembership && !loading)
    return (
      <Button asChild variant="default" className="text-indigo-600 dark:text-indigo-400">
        <Link href="/dashboard/upgrade">
          Upgrade
          <StarIcon className="fill-indigo-600 text-white"></StarIcon>
        </Link>
      </Button>
    );

  if (loading)
    return (
      <Button variant="default" className="text-indigo-600 dark:text-indigo-400">
        <Loader2Icon className="animate-spin" />
      </Button>
    );

  return (
  <Button
  onClick={handleAccount}
   disabled={isPending}
   variant='default'
   className='border-indigo-500 text-indigo-600 dark:text-indigo-400'>
   {isPending ?(
    <Loader2Icon className="animate-spin" />
   ):(
    <p>
        <span className='font-extrabold'>PRO </span>
        Account
    </p>
   )}
  </Button>
  )
}

export default UpgradeButton;
