/**
 * generate-kie-visuals.mjs
 *
 * Generates professional blog images using the Kie.ai Flux Kontext API.
 * Downloads JPGs to public/images/blog/ and outputs <img> tags ready to paste.
 *
 * Usage:
 *   node scripts/generate-kie-visuals.mjs \
 *     --slug <name> \
 *     --prompt1 "first image prompt" \
 *     --prompt2 "second image prompt" \
 *     [--model flux-kontext-pro|flux-kontext-max] \
 *     [--ratio 16:9|4:3|1:1]
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Load .env ────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const API_KEY = process.env.KIE_API_KEY || '7c320adb35316f2f74efd78a5a583c44';
const API_BASE = 'https://api.kie.ai';

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const slug = getArg('--slug');
const prompt1 = getArg('--prompt1');
const prompt2 = getArg('--prompt2');
const model = getArg('--model') || 'flux-kontext-pro';
const aspectRatio = getArg('--ratio') || '16:9';

if (!slug || !prompt1 || !prompt2) {
  console.error(`
Usage:
  node scripts/generate-kie-visuals.mjs \\
    --slug <name> \\
    --prompt1 "first image prompt" \\
    --prompt2 "second image prompt" \\
    [--model flux-kontext-pro|flux-kontext-max] \\
    [--ratio 16:9|4:3|1:1]
`);
  process.exit(1);
}

const OUT_DIR = path.join(ROOT, 'public', 'images', 'blog');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── HTTP helper ──────────────────────────────────────────────────────────────
function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = lib.request(opts, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Download image ────────────────────────────────────────────────────────────
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

// ─── Submit ────────────────────────────────────────────────────────────────────
async function submitGeneration(prompt, num) {
  console.log(`\n[Image ${num}] Submitting prompt: "${prompt.slice(0, 90)}..."`);
  const res = await request('POST', `${API_BASE}/api/v1/flux/kontext/generate`, {
    prompt,
    model,
    aspectRatio,
    outputFormat: 'jpeg',
    promptUpsampling: true,
  });
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Submit failed (HTTP ${res.status}): ${JSON.stringify(res.body)}`);
  }
  const taskId = res.body?.data?.taskId;
  if (!taskId) throw new Error(`No taskId returned: ${JSON.stringify(res.body)}`);
  console.log(`[Image ${num}] Task ID: ${taskId}`);
  return taskId;
}

// ─── Poll ──────────────────────────────────────────────────────────────────────
async function pollForResult(taskId, num, maxMs = 180000) {
  const url = `${API_BASE}/api/v1/flux/kontext/record-info?taskId=${taskId}`;
  const start = Date.now();
  let attempt = 0;

  while (Date.now() - start < maxMs) {
    attempt++;
    await new Promise(r => setTimeout(r, 5000));
    const res = await request('GET', url);
    if (res.status !== 200) { console.log(`[Image ${num}] Poll ${attempt}: HTTP ${res.status}`); continue; }

    const data = res.body?.data;
    const flag = data?.successFlag;

    if (flag === 1) {
      const imageUrl = data?.response?.resultImageUrl;
      if (!imageUrl) throw new Error(`successFlag=1 but no resultImageUrl: ${JSON.stringify(data)}`);
      console.log(`[Image ${num}] Complete after ${Math.round((Date.now() - start) / 1000)}s`);
      return imageUrl;
    }
    if (flag === 2 || flag === 3) throw new Error(`Failed: ${data?.errorMessage || 'unknown'}`);
    console.log(`[Image ${num}] Poll ${attempt} — generating... (${Math.round((Date.now() - start) / 1000)}s elapsed)`);
  }
  throw new Error(`Timed out after ${maxMs / 1000}s`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\nKie.ai Flux Kontext Image Generator');
  console.log(`Model: ${model} | Ratio: ${aspectRatio} | Slug: ${slug}`);
  console.log('─'.repeat(60));

  const prompts = [prompt1, prompt2];
  const results = [];

  for (let i = 0; i < prompts.length; i++) {
    const num = i + 1;
    const filename = `${slug}-0${num}.jpg`;
    const destPath = path.join(OUT_DIR, filename);

    try {
      const taskId = await submitGeneration(prompts[i], num);
      const imageUrl = await pollForResult(taskId, num);
      console.log(`[Image ${num}] Downloading → public/images/blog/${filename}`);
      await downloadFile(imageUrl, destPath);
      const sizeMB = (fs.statSync(destPath).size / 1024 / 1024).toFixed(2);
      console.log(`[Image ${num}] Saved (${sizeMB} MB)`);
      results.push({ filename, ok: true });
    } catch (err) {
      console.error(`[Image ${num}] ERROR: ${err.message}`);
      results.push({ filename, ok: false, error: err.message });
    }

    if (i < prompts.length - 1) await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n' + '─'.repeat(60));
  console.log('IMG TAGS — paste into your blog page:\n');
  for (const r of results) {
    if (r.ok) {
      console.log(`<img
  src="/images/blog/${r.filename}"
  alt="TODO: descriptive alt text"
  width={1200}
  height={675}
  loading="lazy"
  className="rounded-xl my-6 mx-auto block max-w-2xl"
/>\n`);
    } else {
      console.log(`<!-- FAILED: ${r.filename} — ${r.error} -->\n`);
    }
  }

  const ok = results.filter(r => r.ok).length;
  console.log(`${ok}/${prompts.length} images generated successfully.`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
