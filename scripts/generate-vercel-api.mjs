/**
 * generate-vercel-api.mjs
 * Auto-generates api/<name>.ts wrapper files for every Netlify function.
 * Each wrapper imports the original handler and passes it through the toVercel adapter.
 * Run once: node scripts/generate-vercel-api.mjs
 */

import { readdirSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

const functionsDir = 'netlify/functions';
const apiDir = 'api';

const files = readdirSync(functionsDir);
let created = 0;

for (const file of files) {
  // Skip shared helpers, test files, and non-TypeScript files
  if (file.startsWith('_') || file.startsWith('.') || !file.endsWith('.ts')) continue;

  const name = basename(file, '.ts');

  const content = `import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handler } from '../netlify/functions/${name}';
import { toVercel } from './_netlify-compat';

// Disable Vercel's body parser — raw body needed for webhook signature verification
export const config = { api: { bodyParser: false } };

const vercelHandler = toVercel(handler);
export default (req: VercelRequest, res: VercelResponse) => vercelHandler(req, res);
`;

  writeFileSync(join(apiDir, `${name}.ts`), content);
  console.log(`  created api/${name}.ts`);
  created++;
}

console.log(`\nDone. Generated ${created} Vercel API wrappers in api/`);
