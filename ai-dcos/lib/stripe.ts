import { Stripe } from 'stripe';

const stripeSecretKey = process.env.STRIPE_API_KEY;

if(!stripeSecretKey){
    throw new Error("stripeSecretKey is missing");
    
}

const stripe = new Stripe(stripeSecretKey)


export default stripe;
