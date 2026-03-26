/**
 * Build-time prerender script for Boltcall.
 *
 * After `vite build`, this script:
 *   1. Serves dist/ on a local port
 *   2. Visits each public route with Puppeteer
 *   3. Saves the fully-rendered HTML to dist/[route]/index.html
 *
 * Result: Netlify serves static HTML to all visitors (including AI bots).
 * React hydrates on the client, so the SPA still works for humans.
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = 45678;

// All public routes to prerender (no dashboard, auth, or dynamic routes)
const ROUTES = [
  '/',
  '/about',
  '/pricing',
  '/blog',
  '/seo-audit',
  '/ai-revenue-audit',
  '/ai-revenue-calculator',
  '/ai-visibility-check',
  '/newsletter',
  '/contact',
  '/free-website',
  '/free-website-package',
  '/features/ai-receptionist',
  '/features/ai-follow-up-system',
  '/features/automated-reminders',
  '/features/instant-form-reply',
  '/features/lead-reactivation',
  '/features/smart-website',
  '/features/sms-booking-assistant',
  '/features/website-widget',
  '/comparisons',
  '/compare/boltcall-vs-podium',
  '/compare/boltcall-vs-gohighlevel',
  '/compare/boltcall-vs-birdeye',
  '/compare/boltcall-vs-emitrr',
  '/compare/boltcall-vs-calomation',
  '/comparisons/answering-services-vs-boltcall',
  '/comparisons/call-centers-vs-boltcall',
  '/comparisons/crm-vs-boltcall',
  '/comparisons/receptionist-vs-boltcall',
  '/comparisons/voicemail-vs-boltcall',
  '/ai-guide-for-businesses',
  '/ai-guide-for-businesses/level-1-understanding-ai',
  '/ai-guide-for-businesses/level-2-choosing-ai-tools',
  '/ai-guide-for-businesses/level-3-getting-started',
  '/ai-agent-comparison',
  '/ai-audit',
  '/business-audit',
  '/conversion-rate-optimizer',
  '/funnel-optimizer',
  '/help-center',
  '/documentation',
  '/privacy-policy',
  '/terms-of-service',
  '/seo-aeo-audit',
  '/solar-speed-playbook',
  '/speed-test',
  '/strike-ai',
  '/rank-on-google-offer',
  '/giveaway',
  // Blog posts
  '/blog/5-signs-you-need-ai-receptionist',
  '/blog/ai-chatbot-vs-live-chat-phone-answering',
  '/blog/ai-phone-answering-dentists',
  '/blog/ai-phone-answering-plumbers',
  '/blog/ai-receptionist-for-plumbers',
  '/compare/boltcall-vs-smith-ai',
  '/ai-readiness-scorecard',
  '/ai-receptionist-roi',
  '/blog/ai-receptionist-cost-pricing',
  '/blog/ai-vs-human-receptionist',
  '/blog/answering-service-scheduling',
  '/blog/automatic-google-reviews',
  '/blog/benefits-of-outsourced-reception-services',
  '/blog/best-after-hours-answering-service',
  '/blog/best-ai-receptionist-small-business',
  '/blog/best-ai-receptionist-tools',
  '/blog/complete-guide-to-seo',
  '/blog/create-gemini-gem-business-assistant',
  '/blog/google-reviews-automation-local-business',
  '/blog/how-ai-receptionist-works',
  '/blog/how-instant-lead-reply-works',
  '/blog/how-to-make-ai-receptionist',
  '/blog/how-to-schedule-text',
  '/blog/instant-lead-reply-guide',
  '/blog/is-ai-receptionist-worth-it',
  '/blog/phone-call-scripts',
  '/blog/setup-instant-lead-reply',
  '/blog/speed-to-lead-local-business',
  '/blog/the-new-reality-for-local-businesses',
  '/blog/tips-for-professional-telephone-etiquette',
  '/blog/top-10-ai-receptionist-agencies',
  '/blog/understanding-live-answering-service-costs',
  '/blog/what-is-ai-receptionist-guide',
  '/blog/why-speed-matters',
  '/blog/why-website-speed-is-everything',
  '/blog/will-receptionists-be-replaced-by-ai',
];

// Simple static file server
function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      let filePath = join(DIST, url.pathname);

      // Try exact file, then /index.html, then fall back to root index.html (SPA)
      for (const candidate of [filePath, join(filePath, 'index.html'), join(DIST, 'index.html')]) {
        try {
          await access(candidate);
          const content = await readFile(candidate);
          const ext = candidate.split('.').pop();
          const types = { html: 'text/html', js: 'application/javascript', css: 'text/css', json: 'application/json', png: 'image/png', svg: 'image/svg+xml', ico: 'image/x-icon', webmanifest: 'application/manifest+json' };
          res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
          res.end(content);
          return;
        } catch { continue; }
      }
      res.writeHead(404);
      res.end('Not found');
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function prerender() {
  console.log(`Prerendering ${ROUTES.length} routes...\n`);

  const server = await startServer();
  // On Netlify CI, use the system Chromium if puppeteer's bundled one isn't found
  const launchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  };

  // On Netlify CI, use Chromium installed by netlify-plugin-chromium
  if (process.env.CHROMIUM_PATH) {
    console.log(`Using Chromium from plugin: ${process.env.CHROMIUM_PATH}`);
    launchOptions.executablePath = process.env.CHROMIUM_PATH;
  } else if (process.env.NETLIFY || process.env.CI) {
    const { execSync } = await import('child_process');
    try {
      const chromePath = execSync('which chromium-browser || which chromium || which google-chrome-stable || which google-chrome', { encoding: 'utf8' }).trim();
      if (chromePath) {
        console.log(`Using system Chrome: ${chromePath}`);
        launchOptions.executablePath = chromePath;
      }
    } catch {
      console.log('No system Chrome found, using puppeteer bundled Chromium');
    }
  }

  const browser = await puppeteer.launch(launchOptions);

  let success = 0;
  let failed = 0;

  for (const route of ROUTES) {
    try {
      const page = await browser.newPage();

      // Block heavy resources that don't affect HTML content
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'media', 'font'].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Force English locale so prerendered pages always get lang="en"
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'language', { get: () => 'en' });
        Object.defineProperty(navigator, 'languages', { get: () => ['en'] });
        localStorage.setItem('i18nextLng', 'en');
      });

      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 15000,
      });

      // Wait for React to render content
      await page.waitForSelector('#root > *', { timeout: 10000 });

      // Ensure lang="en" and correct og:url/canonical in prerendered output
      await page.evaluate((r) => {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        const canonUrl = 'https://boltcall.org' + (r === '/' ? '/' : r.replace(/\/$/, ''));
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = canonUrl;
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', canonUrl);
      }, route);

      // Get the full rendered HTML
      const html = await page.content();

      // Determine output path
      const outDir = route === '/'
        ? DIST
        : join(DIST, ...route.split('/').filter(Boolean));

      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, 'index.html'), html);

      success++;
      process.stdout.write(`  [${success + failed}/${ROUTES.length}] ${route}\r`);

      await page.close();
    } catch (err) {
      failed++;
      console.error(`  FAIL: ${route} — ${err.message}`);
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPrerender complete: ${success} success, ${failed} failed out of ${ROUTES.length} routes.`);

  // Don't fail the build for a few broken pages — log them and continue
  if (failed > 0 && failed > ROUTES.length * 0.2) {
    console.error('Too many failures (>20%). Failing build.');
    process.exit(1);
  }
}

prerender();
