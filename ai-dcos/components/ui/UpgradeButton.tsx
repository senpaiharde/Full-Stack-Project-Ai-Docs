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
  if (!hasActiveMembership && !loading) return <Button asChild variant="default"></Button>;
  return <div>UpgradeButton</div>;
}

export default UpgradeButton;
