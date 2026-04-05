/**
 * Stripe Checkout - lazily loaded only when user initiates checkout.
 * This file contains loadStripe and checkout redirect logic.
 * Separated from stripe.ts to avoid loading 221KB Stripe JS on every page.
 */
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import type { PlanLevel, BillingInterval } from './stripe';

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
}

interface CheckoutParams {
  plan: PlanLevel;
  interval: BillingInterval;
}

/**
 * Redirect user to Stripe Checkout for subscription
 */
export async function redirectToCheckout({ plan, interval }: CheckoutParams) {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan,
      interval,
      userId: user?.id || '',
      email: user?.email || '',
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  // Redirect to Stripe Checkout
  if (data.url) {
    window.location.href = data.url;
  }
}

/**
 * Open PayPal subscription management.
 * PayPal doesn't have an embeddable portal — users manage subscriptions at paypal.com.
 */
export async function openCustomerPortal() {
  const { getUserSubscription } = await import('./stripe');
  const sub = await getUserSubscription();

  if (sub?.paypal_subscription_id) {
    // Direct link to manage this specific PayPal subscription
    window.open(
      `https://www.paypal.com/myaccount/autopay/connect/${sub.paypal_subscription_id}`,
      '_blank'
    );
  } else {
    // Fallback: general PayPal subscription management
    window.open('https://www.paypal.com/myaccount/autopay', '_blank');
  }
}
