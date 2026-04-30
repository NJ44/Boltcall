import * as crypto from 'crypto';

/**
 * Constant-time HMAC-SHA256 signature verification.
 *
 * Returns:
 *   - 'valid'   — signature matches
 *   - 'invalid' — signature provided but mismatch (reject the request)
 *   - 'missing' — no secret configured OR no header present (caller decides)
 */
export type SigResult = 'valid' | 'invalid' | 'missing';

function timingSafeHexEqual(expectedHex: string, providedHex: string): boolean {
  if (expectedHex.length !== providedHex.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedHex, 'hex'),
      Buffer.from(providedHex, 'hex'),
    );
  } catch {
    return false;
  }
}

/**
 * Verify a Retell webhook signature.
 *
 * Retell sends `x-retell-signature: <hex>` where the value is the HMAC-SHA256
 * of the raw event body using the API key as the secret.
 *
 * Returns 'missing' if no secret is configured (e.g. local dev without RETELL_API_KEY)
 * so the caller can choose to allow vs reject.
 */
export function verifyRetellSignature(
  rawBody: string,
  headers: Record<string, string | undefined>,
): SigResult {
  const secret = process.env.RETELL_API_KEY;
  if (!secret) return 'missing';

  const provided =
    headers['x-retell-signature'] ||
    headers['X-Retell-Signature'] ||
    headers['x-retell-signature-256'] ||
    '';

  if (!provided) return 'missing';

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  // Some Retell versions prefix with `sha256=` — strip it.
  const cleaned = provided.startsWith('sha256=') ? provided.slice(7) : provided;
  return timingSafeHexEqual(expected, cleaned) ? 'valid' : 'invalid';
}

/**
 * Verify a Cal.com webhook signature.
 *
 * Cal.com sends `X-Cal-Signature-256: <hex>` (or sometimes `sha256=<hex>`).
 * The signature is HMAC-SHA256 of the raw event body using the webhook secret
 * configured when the subscription was created.
 */
export function verifyCalcomSignature(
  rawBody: string,
  headers: Record<string, string | undefined>,
): SigResult {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (!secret) return 'missing';

  const provided =
    headers['x-cal-signature-256'] ||
    headers['X-Cal-Signature-256'] ||
    headers['x-cal-signature'] ||
    headers['X-Cal-Signature'] ||
    '';

  if (!provided) return 'missing';

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const cleaned = provided.startsWith('sha256=') ? provided.slice(7) : provided;
  return timingSafeHexEqual(expected, cleaned) ? 'valid' : 'invalid';
}

/**
 * Verify a Facebook webhook signature.
 *
 * Facebook sends `X-Hub-Signature-256: sha256=<hex>` where the value is the
 * HMAC-SHA256 of the raw event body using the App Secret.
 */
export function verifyFacebookSignature(
  rawBody: string,
  headers: Record<string, string | undefined>,
): SigResult {
  const secret = process.env.FB_APP_SECRET;
  if (!secret) return 'missing';

  const provided =
    headers['x-hub-signature-256'] ||
    headers['X-Hub-Signature-256'] ||
    '';

  if (!provided) return 'missing';
  if (!provided.startsWith('sha256=')) return 'invalid';

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return timingSafeHexEqual(expected, provided.slice(7)) ? 'valid' : 'invalid';
}
