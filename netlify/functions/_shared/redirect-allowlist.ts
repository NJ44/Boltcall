// Allowlist for caller-supplied success_url / cancel_url params.
// Any URL not matching is rejected — prevents post-payment open redirects to
// attacker-controlled domains. Shared by Stripe + PayPal checkout functions.

const ALLOWED_REDIRECT_HOSTS = new Set([
  'boltcall.org',
  'www.boltcall.org',
  'boltcall.netlify.app',
  'localhost',
]);

export function isAllowedRedirect(url: string | undefined): boolean {
  if (!url) return true; // empty/undefined is fine — server falls back to a default
  try {
    const parsed = new URL(url);
    // Allow Netlify deploy previews (deploy-preview-N--boltcall.netlify.app, branch-deploys, etc)
    if (parsed.hostname.endsWith('.netlify.app')) return true;
    return ALLOWED_REDIRECT_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}
