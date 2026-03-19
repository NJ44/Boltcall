import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
}

export type PlanLevel = 'starter' | 'pro' | 'ultimate' | 'enterprise';
export type BillingInterval = 'monthly' | 'yearly';

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
 * Get current user's subscription from Supabase
 */
export async function getUserSubscription() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
  }

  return data;
}

/**
 * Get user's invoices from Supabase
 */
export async function getUserInvoices(limit = 10) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }

  return data || [];
}

/**
 * Open Stripe Customer Portal for managing subscription
 */
export async function openCustomerPortal() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Get customer ID from subscription
  const sub = await getUserSubscription();
  if (!sub?.stripe_customer_id) {
    throw new Error('No active subscription found');
  }

  // For now, redirect to contact. In production, create a portal session via Netlify function
  window.location.href = '/contact';
}

/**
 * Plan display info
 */
export const PLAN_INFO: Record<PlanLevel, { name: string; monthlyPrice: number; yearlyPrice: number; tokens: number }> = {
  starter: { name: 'Starter', monthlyPrice: 99, yearlyPrice: 948, tokens: 1000 },
  pro: { name: 'Pro', monthlyPrice: 179, yearlyPrice: 1716, tokens: 3000 },
  ultimate: { name: 'Ultimate', monthlyPrice: 249, yearlyPrice: 2388, tokens: 10000 },
  enterprise: { name: 'Enterprise', monthlyPrice: 997, yearlyPrice: 11964, tokens: 50000 },
};
