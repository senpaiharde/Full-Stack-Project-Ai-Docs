'use server';

import { UserDetails } from '@/app/dashboard/upgrade/page';
import stripe from '@/lib/stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { auth } from '@clerk/nextjs/server';

export async function createCheckoutSession(userDetails: UserDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('user missing');
  }

  const supabase = getSupabaseServerClient;

  const { data: existingSub, error: fetchErr } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (fetchErr && fetchErr.code !== 'PGRST116') {
    // handles the PGRST116 error if its empty
    throw fetchErr;
  }

  let stripeCustomerId = existingSub?.stripe_customer_id;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: { userId },
    });

    const { error: upsertErr } = await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: customer.id,
      is_pro: false,
      plan: 'free',
      expires_at: null,
    });

    if (upsertErr) throw upsertErr;
    stripeCustomerId = customer.id;
  }
   const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [
      { price: "price_1RfOmfRdk979SLwZnBIeCaZu", quantity: 1 },
    ],
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseUrl()}/upgrade`,
  });

  return session.id;
}
