// Shared PayPal REST client for CLI scripts in scripts/paypal/.
//
// Reads .env at the repo root and picks sandbox vs live credentials based on
// PAYPAL_MODE. Run any script via `node scripts/paypal/<name>.mjs`.

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, '../../.env');

function loadEnv() {
  if (!existsSync(ENV_PATH)) return;
  const raw = readFileSync(ENV_PATH, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

const isSandbox = process.env.PAYPAL_MODE === 'sandbox';

export const MODE = isSandbox ? 'sandbox' : 'live';
export const API_BASE = isSandbox
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

const CLIENT_ID = isSandbox
  ? process.env.PAYPAL_SANDBOX_CLIENT_ID
  : process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = isSandbox
  ? process.env.PAYPAL_SANDBOX_CLIENT_SECRET
  : process.env.PAYPAL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    `\nMissing PayPal credentials for MODE=${MODE}.\n` +
    `Set ${isSandbox ? 'PAYPAL_SANDBOX_CLIENT_ID + PAYPAL_SANDBOX_CLIENT_SECRET' : 'PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET'} in .env.\n`
  );
  process.exit(1);
}

let cachedToken = null;

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    throw new Error(`PayPal auth failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };
  return data.access_token;
}

export async function paypal(method, path, body) {
  const token = await getAccessToken();
  const init = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    },
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, init);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`PayPal ${method} ${path} failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function banner(title) {
  const line = '─'.repeat(Math.max(50, title.length + 4));
  console.log(`\n${line}\n  ${title}  [${MODE}]\n${line}`);
}

export function fail(err) {
  console.error('\n✖ Error:', err.message);
  if (err.data) console.error(JSON.stringify(err.data, null, 2));
  process.exit(1);
}
