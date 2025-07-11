'use client';

import { createCheckoutSession } from '@/actions/createCheckoutSession';
import { createStripePortal } from '@/actions/createStripePortal';
import { Button } from '@/components/button';
import useSubscription from '@/hooks/helperSubscription';
import getStripe from '@/lib/strip.js';
import { useUser } from '@clerk/nextjs';

import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';

export type UserDetails = {
  email: any;
  name: string;
};
function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); /// cool feac is pending + makes the site active for user file there is pending in action

  const { hasActiveMembership, loading } = useSubscription();

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      // takes the user details as we send prefill the data user already has for e.x last payment data
      email: user.primaryEmailAddress?.toString(),
      name: user.fullName!,
    };

    startTransition(async () => {
      //payment
      const stripePortalUrl = await getStripe();
       if (!stripePortalUrl) throw new Error("Stripe.js failed to load");
      if (hasActiveMembership) {
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      }



      
      const sessionId = await createCheckoutSession(userDetails);
      await stripePortalUrl?.redirectToCheckout({
        sessionId,
      });
    });
  };

  return (
    <div className="">
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Supercharge your Document Companion
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600">
          choose an affordable plan thats packed with the best features for interacting with PDFs,
          enhancing productivity, and streamlining your workflow.
        </p>
        <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl">
          <div className="ring-1 ring-gray-200 p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">Starter Plan</h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">Explore core Features at No Cost</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">Free</span>
            </p>
            <ul role="list" className="mt-8 space-y-3 text-sm loading-6 text-gray-600">
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />2 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Up to 3 messages per documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Try out the AI chat Functionality
              </li>
            </ul>
          </div>

          <div className="ring-2 ring-indigo-600 rounded-3xl p-8">
            <h3 className="text-lg font-semibold leading-8 text-indigo-600">Pro Plan</h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximize Productivity with PRO Features
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">$5.99</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">/ month</span>
            </p>
            <Button
              disabled={loading || isPending}
              className="bg-indigo-600 w-full text-white shadow-sm hover:bg-indigo-500 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 
            focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleUpgrade}>
              {isPending || loading
                ? 'Loading...'
                : hasActiveMembership
                ? 'Manage Plan'
                : 'Upgrade to Pro'}
            </Button>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Store upto 20 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Ability to Delete Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Up to 100 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Full Power AI Chat Functionality with Memory Recall
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Advanced analytics
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                24-hour support response time
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
