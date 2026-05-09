#!/usr/bin/env node
/**
 * gsc-stuck-urls.mjs
 *
 * Read-only diagnostic. For every URL in public/sitemap.xml, query Google
 * Search Console's URL Inspection API and write a CSV grouping each URL by
 * coverage state. Used to identify pages stuck as
 * "Discovered – currently not indexed" so they can be triaged (KEEP/PRUNE).
 *
 * Reuses the same service account auth as scripts/gsc-submit.mjs.
 *
 * Usage:
 *   node scripts/gsc-stuck-urls.mjs
 *     → writes Marketing/output/<today>/gsc-stuck-urls.csv (all URLs, with
 *       a `decision` column blank for human triage)
 *
 *   STUCK_ONLY=1 node scripts/gsc-stuck-urls.mjs
 *     → only writes URLs whose coverageState matches the stuck pattern
 *
 * API: https://searchconsole.googleapis.com/v1/urlInspection/index:inspect
 *   Quota: 2,000/day, 600/min. We rate-limit to 150ms/request.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SA_CANDIDATES = [
  process.env.GSC_SERVICE_ACCOUNT,
  resolve(__dirname, '../../gsc-service-account.json'),
  // Fallback for runs from a git worktree, where ../../ no longer points
  // to Desktop/Boltcall_website/.
  'C:/Users/Asus/Desktop/Boltcall_website/gsc-service-account.json',
].filter(Boolean);
const SA_PATH = SA_CANDIDATES.find(p => existsSync(p));
if (!SA_PATH) {
  throw new Error(
    'Service account JSON not found. Tried: ' + SA_CANDIDATES.join(', ')
  );
}
const SITEMAP_PATH = resolve(__dirname, '../public/sitemap.xml');
const SITE_URL = 'sc-domain:boltcall.org';
const TODAY = new Date().toISOString().split('T')[0];
const OUTPUT_DIR = resolve(__dirname, `../../../Marketing/output/${TODAY}`);
const OUTPUT_PATH = join(OUTPUT_DIR, 'gsc-stuck-urls.csv');
const STUCK_ONLY = process.env.STUCK_ONLY === '1';
const RATE_LIMIT_MS = 150;

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

function readSitemapUrls() {
  if (!existsSync(SITEMAP_PATH)) {
    throw new Error(`sitemap.xml not found at ${SITEMAP_PATH}`);
  }
  const xml = readFileSync(SITEMAP_PATH, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}

function bucketPageType(url) {
  const path = url.replace(/^https?:\/\/[^/]+/, '');
  if (/\/(thank-you|results|report|login)$/.test(path)) return 'form-result';
  if (path.startsWith('/blog/')) return 'blog';
  if (path === '/blog' || path === '/blog/') return 'blog-hub';
  if (path.startsWith('/tools/')) return 'calculator';
  if (path.startsWith('/compare/')) return 'comparison';
  if (path.startsWith('/comparisons')) return 'comparison-hub';
  if (path.startsWith('/lead-magnet/')) return 'lead-magnet';
  if (path.startsWith('/features/')) return 'feature';
  if (path.startsWith('/solar')) return 'solar';
  if (path.startsWith('/speed-test')) return 'speed-test';
  if (path.startsWith('/speed-to-lead')) return 'pillar';
  if (path === '/' || /^\/(pricing|about|contact|partners|book-a-call|documentation|api-documentation|ai-course|help-center|privacy-policy|terms-of-service)$/.test(path)) return 'core';
  return 'other';
}

function isStuck(coverageState) {
  if (!coverageState) return false;
  // Google variants: "Discovered – currently not indexed", "Discovered - currently not indexed",
  // "Discovered, currently not indexed". Match permissively.
  return /discovered.*not\s*indexed/i.test(coverageState);
}

async function inspectUrl(token, url) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
  });

  const data = await res.json();
  if (!res.ok) {
    return { url, error: data.error?.message || `HTTP ${res.status}` };
  }
  const idx = data.inspectionResult?.indexStatusResult || {};
  return {
    url,
    coverageState: idx.coverageState || '',
    lastCrawlTime: idx.lastCrawlTime || '',
    robotsTxtState: idx.robotsTxtState || '',
    indexingState: idx.indexingState || '',
    pageFetchState: idx.pageFetchState || '',
    verdict: idx.verdict || '',
    googleCanonical: idx.googleCanonical || '',
    userCanonical: idx.userCanonical || '',
  };
}

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const urls = readSitemapUrls();
  console.log(`Read ${urls.length} URLs from sitemap.xml`);

  const token = await getAccessToken([
    'https://www.googleapis.com/auth/webmasters.readonly',
  ]);

  const results = [];
  let stuckCount = 0;
  let errorCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await inspectUrl(token, url);
    if (result.error) {
      errorCount++;
      console.log(`  [${i + 1}/${urls.length}] x ${url} - ${result.error}`);
    } else {
      const stuck = isStuck(result.coverageState);
      if (stuck) stuckCount++;
      const marker = stuck ? '!' : '.';
      const summary = result.coverageState || result.verdict || 'unknown';
      console.log(`  [${i + 1}/${urls.length}] ${marker} ${url} - ${summary}`);
    }
    results.push({ ...result, pageType: bucketPageType(url) });
    if (i < urls.length - 1) await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
  }

  const rows = STUCK_ONLY ? results.filter(r => isStuck(r.coverageState)) : results;

  const header = [
    'url', 'coverageState', 'lastCrawlTime', 'robotsTxtState', 'indexingState',
    'pageFetchState', 'verdict', 'googleCanonical', 'userCanonical',
    'pageType', 'decision', 'prune_method', 'inbound_links_added', 'error',
  ];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push([
      r.url,
      r.coverageState || '',
      r.lastCrawlTime || '',
      r.robotsTxtState || '',
      r.indexingState || '',
      r.pageFetchState || '',
      r.verdict || '',
      r.googleCanonical || '',
      r.userCanonical || '',
      r.pageType || '',
      '', // decision (KEEP|PRUNE) — fill during triage
      '', // prune_method (noindex|410|301) — fill during triage
      '', // inbound_links_added (e.g. 0/3) — fill during Phase 3
      r.error || '',
    ].map(csvEscape).join(','));
  }
  writeFileSync(OUTPUT_PATH, lines.join('\n') + '\n');

  console.log('');
  console.log(`Total URLs inspected:        ${urls.length}`);
  console.log(`Stuck (Discovered-not-idx):  ${stuckCount}`);
  console.log(`Errors:                       ${errorCount}`);
  console.log(`CSV written:                  ${OUTPUT_PATH}`);
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
