/**
 * Stripe types and Supabase-based subscription queries.
 * Does NOT import @stripe/stripe-js to keep the bundle small.
 * For checkout/payment functions, use stripe-checkout.ts (lazy loaded).
 */
import { supabase } from './supabase';

export type PlanLevel = 'starter' | 'pro' | 'ultimate' | 'enterprise';
export type BillingInterval = 'monthly' | 'yearly';

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
 * Plan display info
 */
export const PLAN_INFO: Record<PlanLevel, { name: string; monthlyPrice: number; yearlyPrice: number; tokens: number }> = {
  starter: { name: 'Starter', monthlyPrice: 99, yearlyPrice: 948, tokens: 1000 },
  pro: { name: 'Pro', monthlyPrice: 179, yearlyPrice: 1716, tokens: 3000 },
  ultimate: { name: 'Ultimate', monthlyPrice: 249, yearlyPrice: 2388, tokens: 10000 },
  enterprise: { name: 'Enterprise', monthlyPrice: 997, yearlyPrice: 11964, tokens: 50000 },
};
