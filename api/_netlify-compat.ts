import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * Adapts a Netlify Functions handler to a Vercel serverless handler.
 *
 * Key differences handled:
 *  - event.body        ← raw string read from stream (bodyParser must be disabled)
 *  - event.headers     ← flattened from req.headers (arrays → first value)
 *  - event.queryStringParameters ← flattened from req.query
 *  - event.path        ← req.url (preserves path for UUID extraction in webhooks)
 *  - return { statusCode, headers, body } → res.status().set().send()
 */
export function toVercel(netlifyHandler: Handler) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const rawBody = await readRawBody(req);

    // Flatten multi-value headers to single string values
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        headers[key] = value[0] ?? '';
      } else if (value != null) {
        headers[key] = value;
      }
    }

    // Flatten multi-value query params to single string values
    const queryStringParameters: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.query ?? {})) {
      queryStringParameters[key] = Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
    }

    const event: HandlerEvent = {
      httpMethod: req.method ?? 'GET',
      headers,
      multiValueHeaders: {},
      body: rawBody,
      isBase64Encoded: false,
      path: req.url ?? '/',
      rawUrl: `https://${req.headers.host ?? 'boltcall.org'}${req.url ?? '/'}`,
      rawQuery: new URLSearchParams(queryStringParameters).toString(),
      queryStringParameters,
      multiValueQueryStringParameters: {},
    };

    try {
      const result = await netlifyHandler(event, {} as any);
      if (!result) {
        res.status(500).json({ error: 'No response from handler' });
        return;
      }

      for (const [key, value] of Object.entries(result.headers ?? {})) {
        if (value != null) res.setHeader(key, value as string);
      }

      res.status(result.statusCode).send(result.body ?? '');
    } catch (err: any) {
      console.error('[netlify-compat] Unhandled error:', err?.message ?? err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/** Read the raw request body as a UTF-8 string from the Node.js stream. */
async function readRawBody(req: VercelRequest): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(chunks.length > 0 ? Buffer.concat(chunks).toString('utf8') : null));
    req.on('error', reject);
  });
}
