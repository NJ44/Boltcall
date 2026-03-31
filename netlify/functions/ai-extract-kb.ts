import type { Handler } from '@netlify/functions';
import { deductTokens, TOKEN_COSTS } from './_shared/token-utils';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { content, businessName, category, userId } = JSON.parse(event.body || '{}');

    if (!content) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Content is required' }) };
    }

    // Token gate: deduct before calling Claude
    if (userId) {
      const deductResult = await deductTokens(userId, TOKEN_COSTS.ai_kb_extract, 'ai_kb_extract', `KB extraction for ${businessName || 'unknown'}`);
      if (!deductResult.success) {
        return { statusCode: 402, headers, body: JSON.stringify({ error: 'Insufficient tokens for KB extraction', details: deductResult.error }) };
      }
    }

    // Truncate content to avoid token limits
    const truncatedContent = content.substring(0, 15000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Extract structured business information from this website content for an AI phone receptionist knowledge base.

Business: ${businessName || 'Unknown'}
Category: ${category || 'Unknown'}

Website content:
${truncatedContent}

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "services": [
    { "name": "Service Name", "duration": 30, "price": 0 }
  ],
  "faqs": [
    { "question": "Common question?", "answer": "Answer based on website content" }
  ],
  "policies": {
    "cancellation": "Cancellation policy if found",
    "reschedule": "Reschedule policy if found",
    "deposit": "Payment/deposit policy if found"
  }
}

Rules:
- Extract REAL services/products from the website. Set duration to reasonable estimates (15-60 min). Set price to 0 if not listed.
- Generate 3-5 FAQs that a phone caller would likely ask, based on the website content.
- Only include policies if actually mentioned on the website. Use empty string "" if not found.
- If you can't find services, return an empty array.
- Return ONLY the JSON object, nothing else.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'AI extraction failed' }) };
    }

    const result = await response.json();
    const text = result.content?.[0]?.text || '';

    // Parse the JSON from Claude's response
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { statusCode: 200, headers, body: JSON.stringify({ services: [], faqs: [], policies: null }) };
      }

      const extracted = JSON.parse(jsonMatch[0]);

      // Validate and sanitize the response
      const services = Array.isArray(extracted.services)
        ? extracted.services.filter((s: any) => s.name).map((s: any) => ({
            name: String(s.name).substring(0, 100),
            duration: Math.min(Math.max(Number(s.duration) || 30, 5), 480),
            price: Math.max(Number(s.price) || 0, 0),
          }))
        : [];

      const faqs = Array.isArray(extracted.faqs)
        ? extracted.faqs.filter((f: any) => f.question && f.answer).map((f: any) => ({
            question: String(f.question).substring(0, 300),
            answer: String(f.answer).substring(0, 1000),
          }))
        : [];

      const policies = extracted.policies
        ? {
            cancellation: String(extracted.policies.cancellation || '').substring(0, 500),
            reschedule: String(extracted.policies.reschedule || '').substring(0, 500),
            deposit: String(extracted.policies.deposit || '').substring(0, 500),
          }
        : null;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ services, faqs, policies }),
      };
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', text.substring(0, 200));
      return { statusCode: 200, headers, body: JSON.stringify({ services: [], faqs: [], policies: null }) };
    }
  } catch (error) {
    console.error('AI extract error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }
};

export { handler };
