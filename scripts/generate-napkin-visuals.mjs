/**
 * generate-napkin-visuals.mjs
 *
 * Generates diagrams/infographics from blog page content using the Napkin.ai API.
 * Downloads SVGs/PNGs to public/images/blog/ and outputs <img> tags ready to paste.
 *
 * Usage:
 *   node scripts/generate-napkin-visuals.mjs <blog-page-file> [options]
 *
 * Examples:
 *   node scripts/generate-napkin-visuals.mjs src/pages/BlogNeverMissCallAfterHours.tsx
 *   node scripts/generate-napkin-visuals.mjs src/pages/BlogNeverMissCallAfterHours.tsx --style 3 --format png
 *   node scripts/generate-napkin-visuals.mjs --text "AI receptionist call flow: caller rings → AI answers → qualifies lead → books appointment → sends summary to owner" --slug after-hours-flow
 *
 * Options:
 *   --style <id>      Napkin style ID (1-15). Default: 1. See: https://api.napkin.ai/docs/styles/
 *   --format <fmt>    Output format: svg or png. Default: svg
 *   --slug <name>     Output filename prefix (auto-derived from file if omitted)
 *   --text <str>      Provide text directly instead of extracting from a page file
 *   --variations <n>  Number of visual variations to generate (1-4). Default: 1
 *   --section <n>     Only generate for section number N (1-based index)
 *
 * Requires NAPKIN_API_KEY in .env
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Load .env ─────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  });
  return env;
}

// ── Parse CLI args ────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { style: '1', format: 'svg', variations: 1, positional: [] };
  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case '--style':      args.style = argv[++i]; break;
      case '--format':     args.format = argv[++i]; break;
      case '--slug':       args.slug = argv[++i]; break;
      case '--text':       args.text = argv[++i]; break;
      case '--section':    args.section = parseInt(argv[++i], 10); break;
      case '--variations': args.variations = Math.min(Math.max(parseInt(argv[++i], 10), 1), 4); break;
      default:
        if (!argv[i].startsWith('--')) args.positional.push(argv[i]);
    }
  }
  return args;
}

// ── Extract visual prompts from a TSX blog page ───────────────────────────────
// Grabs each H2 heading + the first paragraph under it as the visual prompt.
function extractPromptsFromTSX(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const prompts = [];

  const h2Pattern = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  let match;
  const h2s = [];
  while ((match = h2Pattern.exec(src)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) h2s.push({ text, index: match.index });
  }

  h2s.forEach(({ text, index }) => {
    const after = src.slice(index, index + 2000);
    const pMatch = after.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const context = pMatch
      ? pMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 400)
      : '';
    prompts.push({ heading: text, context });
  });

  return prompts;
}

// ── Napkin API helpers ────────────────────────────────────────────────────────
const NAPKIN_BASE = 'https://api.napkin.ai';

async function createVisual(token, content, styleId, variations, format) {
  const res = await fetch(`${NAPKIN_BASE}/v1/visual`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      style_id: styleId,
      variations,
      format,
      transparent: false,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Napkin create failed (${res.status}): ${body}`);
  }
  return res.json();
}

async function pollStatus(token, requestId, maxWaitMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(`${NAPKIN_BASE}/v1/visual/${requestId}/status`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Status check failed (${res.status})`);
    const data = await res.json();
    if (data.status === 'completed') return data;
    if (data.status === 'failed') throw new Error(`Napkin generation failed: ${JSON.stringify(data)}`);
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('Timed out waiting for Napkin visual (120s)');
}

async function downloadFile(url, destPath, token) {
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

// ── Derive slug from file path ────────────────────────────────────────────────
function slugFromFile(filePath) {
  return path.basename(filePath, '.tsx')
    .replace(/^Blog/, '')
    .replace(/([A-Z])/g, m => '-' + m.toLowerCase())
    .replace(/^-/, '')
    .toLowerCase();
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const env = loadEnv();
  const token = env.NAPKIN_API_KEY;

  if (!token || token.startsWith('REPLACE')) {
    console.error('\n❌  NAPKIN_API_KEY not set in .env');
    console.error('   Get your key: app.napkin.ai → Account Settings → Developers → Create API token');
    console.error('   Then add to .env:  NAPKIN_API_KEY=your_token_here\n');
    process.exit(1);
  }

  const args = parseArgs(process.argv);
  const format = args.format === 'png' ? 'png' : 'svg';

  // ── Build prompts list
  let prompts = [];

  if (args.text) {
    prompts = [{ heading: args.slug || 'visual', context: args.text }];
  } else if (args.positional[0]) {
    const filePath = path.resolve(ROOT, args.positional[0]);
    if (!fs.existsSync(filePath)) {
      console.error(`❌  File not found: ${filePath}`);
      process.exit(1);
    }
    console.log(`\n📄 Extracting sections from: ${path.basename(filePath)}`);
    prompts = extractPromptsFromTSX(filePath);
    if (!prompts.length) {
      console.error('❌  No H2 headings found. Use --text "content" to provide content manually.');
      process.exit(1);
    }
    if (args.section) {
      const idx = args.section - 1;
      if (!prompts[idx]) {
        console.error(`❌  Section ${args.section} not found (page has ${prompts.length} sections)`);
        process.exit(1);
      }
      prompts = [prompts[idx]];
      console.log(`   Generating only section ${args.section}: "${prompts[0].heading.slice(0, 70)}"`);
    } else {
      console.log(`   Found ${prompts.length} sections\n`);
    }
  } else {
    console.error('❌  Provide a blog page file path or use --text "content"');
    console.error('   Usage: node scripts/generate-napkin-visuals.mjs src/pages/BlogXxx.tsx');
    process.exit(1);
  }

  // ── Output dir
  const outDir = path.join(ROOT, 'public', 'images', 'blog');
  fs.mkdirSync(outDir, { recursive: true });

  const slugPrefix = args.slug ||
    (args.positional[0] ? slugFromFile(args.positional[0]) : 'napkin');

  const results = [];

  // ── Generate one visual per section
  for (let i = 0; i < prompts.length; i++) {
    const { heading, context } = prompts[i];
    const content = context ? `${heading}\n\n${context}` : heading;
    const label = heading.slice(0, 50).replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '-').toLowerCase();
    const filenameBase = `${slugPrefix}-${String(i + 1).padStart(2, '0')}-${label}`;

    console.log(`\n[${i + 1}/${prompts.length}] "${heading.slice(0, 70)}"`);
    process.stdout.write('   Requesting');

    let statusData;
    try {
      if (i > 0) await new Promise(r => setTimeout(r, 1000)); // stay under 2 req/s
      const created = await createVisual(token, content, args.style, args.variations, format);
      const requestId = created.request_id || created.id;
      if (!requestId) throw new Error(`No request ID in response: ${JSON.stringify(created)}`);
      process.stdout.write(` → id: ${requestId} — waiting`);
      statusData = await pollStatus(token, requestId);
    } catch (err) {
      console.error(`\n   ⚠️  Skipped: ${err.message}`);
      continue;
    }

    // ── Download (URLs require auth header — download immediately, expire in 30 min)
    const files = statusData.generated_files || statusData.files || statusData.visuals || [];
    if (!files.length) {
      console.warn('\n   ⚠️  No files returned');
      continue;
    }

    const downloaded = [];
    for (let v = 0; v < files.length; v++) {
      const file = files[v];
      const fileUrl = file.url || file[format] || file.svg || file.png;
      if (!fileUrl) { console.warn(`\n   ⚠️  No URL in variation ${v + 1}`); continue; }

      const varSuffix = files.length > 1 ? `-v${v + 1}` : '';
      const filename = `${filenameBase}${varSuffix}.${format}`;
      const destPath = path.join(outDir, filename);

      try {
        await downloadFile(fileUrl, destPath, token);
        downloaded.push(filename);
        console.log(`\n   ✅ public/images/blog/${filename}`);
      } catch (err) {
        console.error(`\n   ⚠️  Download failed: ${err.message}`);
      }
    }

    if (downloaded.length) results.push({ heading, files: downloaded });
  }

  // ── Output ready-to-paste JSX
  if (!results.length) {
    console.log('\n⚠️  No visuals were generated.\n');
    return;
  }

  console.log('\n\n══════════════════════════════════════════════════');
  console.log('📋  Paste these into your TSX after the relevant section:');
  console.log('══════════════════════════════════════════════════\n');

  results.forEach(({ heading, files }) => {
    console.log(`{/* Visual: ${heading.slice(0, 60)} */}`);
    files.forEach(filename => {
      const alt = heading.replace(/"/g, "'").slice(0, 120);
      console.log(`<img`);
      console.log(`  src="/images/blog/${filename}"`);
      console.log(`  alt="${alt}"`);
      console.log(`  width={800}`);
      console.log(`  height={450}`);
      console.log(`  loading="lazy"`);
      console.log(`  className="rounded-xl my-8 w-full"`);
      console.log(`/>`);
    });
    console.log('');
  });

  console.log('══════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('\n❌  Unexpected error:', err.message);
  process.exit(1);
});
