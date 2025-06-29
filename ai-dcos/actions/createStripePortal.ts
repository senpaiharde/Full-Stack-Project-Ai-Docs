'use server';

import { getSupabaseServerClient } from '@/lib/supabaseServer';
import getBaseUrl from '@/lib/getBaseUrl';
import stripe from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

export async function createStripePortal() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not found');
  }
  const supabase = getSupabaseServerClient;

  const { data: sub, error: fetchErr } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (fetchErr) {
    console.error('Error fetching subscription row', fetchErr);
    throw new Error('Could not fetch subscription');
  }

  const stripeCustomerId = sub?.stripe_customer_id;
  if (!stripeCustomerId) {
    throw new Error('No Stripe customer on file');
  }

  // create the billing-portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`,
  });

  return portalSession.url;
}
