import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handler } from '../netlify/functions/send-email';
import { toVercel } from './_netlify-compat';

// Disable Vercel's body parser — raw body needed for webhook signature verification
export const config = { api: { bodyParser: false } };

const vercelHandler = toVercel(handler);
export default (req: VercelRequest, res: VercelResponse) => vercelHandler(req, res);
