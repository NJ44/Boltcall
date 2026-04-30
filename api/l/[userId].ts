import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handler } from '../../netlify/functions/lead-webhook';
import { toVercel } from '../_netlify-compat';

// Vanity URL /l/:userId → lead-webhook with userId in path for UUID extraction
// Equivalent to Netlify's /l/:userId → /.netlify/functions/lead-webhook/:userId rewrite

export const config = { api: { bodyParser: false } };

const netlifyHandler = toVercel(handler);

export default (req: VercelRequest, res: VercelResponse) => {
  // The userId is already in req.url (e.g. /api/l/550e8400-...) so
  // lead-webhook's path-based UUID regex will find it without any extra work.
  return netlifyHandler(req, res);
};
