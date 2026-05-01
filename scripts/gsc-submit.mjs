#!/usr/bin/env node
/**
 * gsc-submit.mjs
 * Submits sitemap to Google Search Console and requests URL indexing.
 *
 * Usage:
 *   node scripts/gsc-submit.mjs                                        — auto-detect new URLs
 *   NEW_URLS="/blog/post-1,/blog/post-2" node scripts/gsc-submit.mjs  — manual override
 *
 * Auto-detection: diffs public/sitemap.xml against scripts/.gsc-url-cache.json.
 * First run creates the cache with no indexing requests; subsequent runs submit only new URLs.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SA_PATH = resolve(__dirname, '../../gsc-service-account.json');
const SITEMAP_PATH = resolve(__dirname, '../public/sitemap.xml');
const CACHE_PATH = resolve(__dirname, '.gsc-url-cache.json');
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

// Fix Git Bash POSIX-to-Windows path mangling (e.g. /blog/test → C:/Program Files/Git/blog/test)
// Users can also prefix with // to bypass conversion: NEW_URLS="//blog/test"
function normalizePath(urlPath) {
  if (urlPath.startsWith('//')) return urlPath.slice(1);
  if (/^[A-Za-z]:/.test(urlPath)) {
    const parts = urlPath.replace(/\\/g, '/').split('/').filter(Boolean);
    const systemDirs = new Set([
      'program files', 'program files (x86)', 'git', 'usr', 'bin',
      'mingw64', 'msys64', 'mingw32', 'windows', 'system32', 'users', 'home', 'opt',
    ]);
    const startIdx = parts.findIndex(p => !p.endsWith(':') && !systemDirs.has(p.toLowerCase()));
    if (startIdx !== -1) return '/' + parts.slice(startIdx).join('/');
  }
  return urlPath;
}

async function requestIndexing(token, urlPath) {
  const cleaned = normalizePath(urlPath);
  const fullUrl = cleaned.startsWith('http') ? cleaned : `${BASE_URL}${cleaned}`;

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

function detectNewUrls() {
  if (!existsSync(SITEMAP_PATH)) {
    console.log('⚠ sitemap.xml not found — skipping auto-detect');
    return [];
  }

  const xml = readFileSync(SITEMAP_PATH, 'utf8');
  const current = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));

  if (!existsSync(CACHE_PATH)) {
    writeFileSync(CACHE_PATH, JSON.stringify([...current], null, 2));
    console.log(`✓ GSC URL cache initialized (${current.size} URLs) — no indexing on first run`);
    return [];
  }

  const cached = new Set(JSON.parse(readFileSync(CACHE_PATH, 'utf8')));
  const newUrls = [...current].filter(u => !cached.has(u));
  writeFileSync(CACHE_PATH, JSON.stringify([...current], null, 2));
  return newUrls;
}

async function main() {
  const manualUrls = (process.env.NEW_URLS || '')
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  const urlsToIndex = manualUrls.length > 0 ? manualUrls : detectNewUrls();

  const gscToken = await getAccessToken(['https://www.googleapis.com/auth/webmasters']);
  await submitSitemap(gscToken);

  if (urlsToIndex.length > 0) {
    const indexToken = await getAccessToken(['https://www.googleapis.com/auth/indexing']);
    console.log(`\nRequesting indexing for ${urlsToIndex.length} URL(s)...`);
    for (const urlPath of urlsToIndex) {
      await requestIndexing(indexToken, urlPath);
      await new Promise(r => setTimeout(r, 300));
    }
  } else {
    console.log('\nNo new URLs detected.');
  }

  console.log('\n✓ GSC submit complete');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
