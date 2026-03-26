import type { Handler } from '@netlify/functions';

// Firecrawl API keys — waterfall: use key 1 first, if exhausted try key 2, then key 3
const FIRECRAWL_KEYS = [
  process.env.FIRECRAWL_API_KEY_1 || 'fc-36d59dda1eb14a94955d9d26737f99db',
  process.env.FIRECRAWL_API_KEY_2 || 'fc-9aabf45ddf9241ec9d2a61bb2c754d6f',
  process.env.FIRECRAWL_API_KEY_3 || 'fc-c9156afd69464cf6a6bb3b705eff80bd',
];

const N8N_FALLBACK_WEBHOOK = process.env.N8N_SCRAPER_WEBHOOK || 'https://n8n.srv974118.hstgr.cloud/webhook/scrape-website';

// Try Firecrawl with a specific key
async function tryFirecrawl(url: string, apiKey: string): Promise<{ success: boolean; data?: any; exhausted?: boolean }> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    if (response.status === 402 || response.status === 429) {
      return { success: false, exhausted: true };
    }

    if (!response.ok) return { success: false };

    const result = await response.json();
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

// Try n8n fallback webhook
async function tryN8nFallback(url: string): Promise<{ success: boolean; data?: any }> {
  if (!N8N_FALLBACK_WEBHOOK) return { success: false };
  try {
    const response = await fetch(N8N_FALLBACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) return { success: false };
    const data = await response.json();
    if (data.success) return { success: true, data };
    return { success: false };
  } catch {
    return { success: false };
  }
}

// Basic fetch fallback (original scrape-url logic)
async function basicScrape(url: string): Promise<{ title: string; description: string; content: string }> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; BoltcallBot/1.0)',
      'Accept': 'text/html,application/xhtml+xml,text/plain,*/*',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    return { title: url, description: '', content: '' };
  }

  const html = await response.text();

  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '');

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  text = text.replace(/<[^>]+>/g, ' ');
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > 50000) {
    text = text.substring(0, 50000) + '...';
  }

  return { title: title || url, description, content: text };
}

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');

    if (!url) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'URL is required' }) };
    }

    // Strategy: Firecrawl (waterfall) → n8n fallback → basic scrape

    // 1. Try Firecrawl keys in waterfall
    for (let i = 0; i < FIRECRAWL_KEYS.length; i++) {
      console.log(`[scrape-url] Trying Firecrawl key ${i + 1}...`);
      const result = await tryFirecrawl(url, FIRECRAWL_KEYS[i]);

      if (result.exhausted) {
        console.log(`[scrape-url] Key ${i + 1} exhausted, trying next...`);
        continue;
      }

      if (result.success && result.data) {
        const markdown = result.data.markdown || result.data.content || '';
        const metadata = result.data.metadata || {};
        console.log(`[scrape-url] Firecrawl key ${i + 1} succeeded (${markdown.length} chars)`);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            title: metadata.title || metadata.ogTitle || url,
            description: metadata.description || metadata.ogDescription || '',
            content: markdown,
            markdown,
            url,
            charCount: markdown.length,
            source: 'firecrawl',
            metadata: {
              language: metadata.language,
              ogImage: metadata.ogImage,
              links: result.data.links,
            },
          }),
        };
      }
    }

    // 2. Try n8n fallback
    console.log('[scrape-url] Firecrawl exhausted, trying n8n fallback...');
    const n8nResult = await tryN8nFallback(url);
    if (n8nResult.success && n8nResult.data) {
      console.log(`[scrape-url] n8n fallback succeeded (${(n8nResult.data.content || '').length} chars)`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          title: n8nResult.data.title || url,
          description: n8nResult.data.description || '',
          content: n8nResult.data.content || n8nResult.data.markdown || '',
          markdown: n8nResult.data.markdown || n8nResult.data.content || '',
          url,
          charCount: (n8nResult.data.content || '').length,
          source: 'n8n',
        }),
      };
    }

    // 3. Basic scrape fallback
    console.log('[scrape-url] n8n failed, falling back to basic scrape...');
    const basic = await basicScrape(url);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        title: basic.title,
        description: basic.description,
        content: basic.content,
        url,
        charCount: basic.content.length,
        source: 'basic',
      }),
    };
  } catch (error) {
    console.error('Scrape error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        content: '',
        source: 'error',
      }),
    };
  }
};

export { handler };
