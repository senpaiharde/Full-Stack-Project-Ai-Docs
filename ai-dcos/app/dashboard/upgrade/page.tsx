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
        <div>
            <div>
                <h3 className='text-lg font-semibold leading-8 text-gray-900'>
                    Starter Plan
                </h3>
                <p className='mt-4 text-sm leading-6 text-gray-600'>
                    Explore core Features at No Cost
                </p>
                
            </div>


            <div></div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
