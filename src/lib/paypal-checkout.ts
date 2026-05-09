// PayPal Subscription checkout — frontend helper.
//
// Calls /.netlify/functions/create-paypal-subscription with the user's JWT,
// receives an approvalUrl, and redirects the browser there. PayPal handles the
// rest; on approval the user returns to ?paypal=success and the webhook
// activates the subscription in Supabase.

import { supabase } from './supabase';
import type { PlanLevel, BillingInterval } from './stripe';

interface CheckoutParams {
  plan: PlanLevel;
  interval: BillingInterval;
  successUrl?: string;
  cancelUrl?: string;
}

export async function redirectToPayPalCheckout({
  plan,
  interval,
  successUrl,
  cancelUrl,
}: CheckoutParams): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('You must be signed in to start checkout');
  }

  const response = await fetch('/.netlify/functions/create-paypal-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ plan, interval, successUrl, cancelUrl }),
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || `PayPal checkout failed (${response.status})`);
  }

  if (!data.approvalUrl) {
    throw new Error('PayPal did not return an approval URL');
  }

  window.location.href = data.approvalUrl;
}
