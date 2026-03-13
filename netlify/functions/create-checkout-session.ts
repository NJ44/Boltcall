import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

// Map plan levels + intervals to Stripe Price IDs
const PRICE_MAP: Record<string, string | undefined> = {
  'starter_monthly': process.env.STRIPE_PRICE_STARTER_MONTHLY,
  'starter_yearly': process.env.STRIPE_PRICE_STARTER_YEARLY,
  'pro_monthly': process.env.STRIPE_PRICE_PRO_MONTHLY,
  'pro_yearly': process.env.STRIPE_PRICE_PRO_YEARLY,
  'agency_monthly': process.env.STRIPE_PRICE_AGENCY_MONTHLY,
  'agency_yearly': process.env.STRIPE_PRICE_AGENCY_YEARLY,
};

const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { plan, interval, userId, email, successUrl, cancelUrl } = JSON.parse(event.body || '{}');

    if (!plan || !interval) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing plan or interval' }),
      };
    }

    const priceKey = `${plan}_${interval}`;
    const priceId = PRICE_MAP[priceKey];

    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: `Invalid plan/interval: ${priceKey}` }),
      };
    }

    // Create Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${event.headers.origin || 'https://tryboltcall.com'}/dashboard/settings/plan-billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: cancelUrl || `${event.headers.origin || 'https://tryboltcall.com'}/pricing?canceled=true`,
      metadata: {
        userId: userId || '',
        plan,
        interval,
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          plan,
          interval,
        },
      },
    };

    // Pre-fill email if provided
    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id, url: session.url }),
    };
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to create checkout session' }),
    };
  }
};

export { handler };
