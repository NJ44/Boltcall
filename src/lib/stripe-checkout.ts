/**
 * Subscription management — lazily loaded.
 * Handles PayPal subscription portal redirect.
 */
import { supabase } from './supabase';

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
