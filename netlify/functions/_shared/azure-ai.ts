/**
 * Azure OpenAI helper — replaces direct Anthropic API calls.
 *
 * Priority:
 *   1. Azure OpenAI  (AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_API_KEY)
 *   2. Anthropic     (ANTHROPIC_API_KEY)  ← migration fallback
 *
 * Env vars:
 *   AZURE_OPENAI_ENDPOINT          https://<resource>.openai.azure.com
 *   AZURE_OPENAI_API_KEY           Azure OpenAI API key
 *   AZURE_OPENAI_DEPLOYMENT        deployment name, e.g. gpt-4o-mini  [default: gpt-4o-mini]
 *   AZURE_OPENAI_DEPLOYMENT_HEAVY  heavier deployment, e.g. gpt-4o   [default: same as above]
 *   AZURE_OPENAI_API_VERSION       optional, defaults to 2024-02-01
 */

const AZURE_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-02-01';

export function getAzureDeployment(heavy = false): string {
  if (heavy) {
    return (
      process.env.AZURE_OPENAI_DEPLOYMENT_HEAVY ||
      process.env.AZURE_OPENAI_DEPLOYMENT ||
      'gpt-4o'
    );
  }
  return process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';
}

export function isAzureConfigured(): boolean {
  return !!(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY);
}

/**
 * Simple chat completion — returns raw text.
 * Uses Azure OpenAI when configured; falls back to Anthropic.
 */
export async function chatCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: { maxTokens?: number; heavy?: boolean } = {},
): Promise<string> {
  const { maxTokens = 512, heavy = false } = options;

  if (isAzureConfigured()) {
    return azureChatCompletion(systemPrompt, userPrompt, maxTokens, heavy);
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    return anthropicChatCompletion(anthropicKey, systemPrompt, userPrompt, maxTokens, heavy);
  }

  throw new Error(
    'No AI provider configured. Set AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_API_KEY, or ANTHROPIC_API_KEY.',
  );
}

async function azureChatCompletion(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  heavy: boolean,
): Promise<string> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/$/, '');
  const apiKey = process.env.AZURE_OPENAI_API_KEY!;
  const deployment = getAzureDeployment(heavy);
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${AZURE_API_VERSION}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Azure OpenAI error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Image generation — returns base64-encoded PNG string.
 * Requires Azure OpenAI to be configured (AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_API_KEY).
 * Uses AZURE_OPENAI_IMAGE_DEPLOYMENT env var (default: gpt-image-2).
 */
export async function generateImage(
  prompt: string,
  options: {
    size?: '1024x1024' | '1536x1024' | '1024x1536';
    quality?: 'low' | 'medium' | 'high';
  } = {},
): Promise<string> {
  if (!isAzureConfigured()) {
    throw new Error(
      'Azure OpenAI not configured. Set AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_API_KEY.',
    );
  }
  const { size = '1024x1024', quality = 'high' } = options;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/$/, '');
  const apiKey = process.env.AZURE_OPENAI_API_KEY!;
  const deployment = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT || 'gpt-image-2';
  const url = `${endpoint}/openai/deployments/${deployment}/images/generations?api-version=2024-05-01-preview`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ prompt, size, quality, n: 1, output_format: 'png' }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Azure OpenAI image error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.data?.[0]?.b64_json || '';
}

async function anthropicChatCompletion(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  heavy: boolean,
): Promise<string> {
  const model = heavy ? 'claude-sonnet-4-20250514' : 'claude-haiku-4-5-20251001';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}
