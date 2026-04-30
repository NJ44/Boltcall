#!/usr/bin/env node
/**
 * gsc-submit.mjs
 * Submits sitemap to Google Search Console and requests URL indexing.
 *
 * Usage:
 *   node scripts/gsc-submit.mjs
 *   NEW_URLS="/blog/post-1,/blog/post-2" node scripts/gsc-submit.mjs
 *
 * Env:
 *   NEW_URLS  — comma-separated URL paths to request indexing for (optional)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SA_PATH = resolve(__dirname, '../../gsc-service-account.json');
const SITE_URL = 'sc-domain:boltcall.org';
const SITEMAP_URL = 'https://boltcall.org/sitemap.xml';
const BASE_URL = 'https://boltcall.org';

const sa = JSON.parse(readFileSync(SA_PATH, 'utf8'));

async function getAccessToken(scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(sa.private_key, 'base64url');
  const jwt = `${header}.${payload}.${sig}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function submitSitemap(token) {
  const encodedSite = encodeURIComponent(SITE_URL);
  const encodedFeed = encodeURIComponent(SITEMAP_URL);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedFeed}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok || res.status === 204) {
    console.log('✓ Sitemap submitted to Google Search Console');
  } else {
    const text = await res.text();
    console.log(`⚠ Sitemap submit: ${res.status} — ${text.slice(0, 200)}`);
  }
}

async function requestIndexing(token, urlPath) {
  const fullUrl = urlPath.startsWith('http') ? urlPath : `${BASE_URL}${urlPath}`;

  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: fullUrl, type: 'URL_UPDATED' }),
  });

  const data = await res.json();
  if (res.ok) {
    console.log(`✓ Indexing requested: ${fullUrl}`);
  } else {
    const msg = data.error?.message || JSON.stringify(data);
    console.log(`⚠ Indexing skipped for ${fullUrl}: ${msg}`);
    if (res.status === 403) {
      console.log('  → To fix: add the service account as a verified owner in GSC');
    }
  }
}

async function main() {
  const newUrls = (process.env.NEW_URLS || '')
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  const gscToken = await getAccessToken(['https://www.googleapis.com/auth/webmasters']);
  await submitSitemap(gscToken);

  if (newUrls.length > 0) {
    const indexToken = await getAccessToken(['https://www.googleapis.com/auth/indexing']);
    console.log(`\nRequesting indexing for ${newUrls.length} URL(s)...`);
    for (const urlPath of newUrls) {
      await requestIndexing(indexToken, urlPath);
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log('\n✓ GSC submit complete');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
