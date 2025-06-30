import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new NextResponse('Missing stripe-signature', { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = getSupabaseServerClient;
/// event listener at strip
  switch (event.type) {
    case 'checkout.session.completed':
    case 'payment_intent.succeeded': {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string | undefined;
      const customerId = session.customer as string;

      let expiresAt: string | null = null;
      if (subscriptionId) {
        
        const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;

       
        expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
      }

      // mark user as PRO in `subscriptions` table
      const { error: upErr } = await supabase
        .from('subscriptions')
        .update({
          is_pro: true,
          expires_at: expiresAt,
        })
        .eq('stripe_customer_id', customerId);

      if (upErr) console.error('Supabase update error:', upErr);
      break;
    }

    case 'customer.subscription.deleted': 
    case 'subscription_schedule.canceled': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { error: upErr } = await supabase
        .from('subscriptions')
        .update({ is_pro: false })
        .eq('stripe_customer_id', customerId);

      if (upErr) console.error('Supabase update error:', upErr);
      break;
    }

    default:
      console.log(`  Unhandled Stripe event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
