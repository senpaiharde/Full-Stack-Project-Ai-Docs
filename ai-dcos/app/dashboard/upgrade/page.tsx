import { CheckIcon } from 'lucide-react';
import React from 'react';

function PricingPage() {
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

          <div className='ring-2 ring-indigo-600 rounded-3xl p-8'>
            <h3 className='text-lg font-semibold leading-8 text-indigo-600'>
                Pro Plan
            </h3>
            <p className='mt-4 text-sm leading-6 text-gray-600'>
                Maximize Productivity with PRO Features
            </p>
            <p className='mt-6 flex items-baseline gap-x-1'>
                <span className='text-4xl font-bold tracking-tight text-gray-900'>
                    $5.99
                </span>
                <span className='text-sm font-semibold leading-6 text-gray-600'>
                    / month
                </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
