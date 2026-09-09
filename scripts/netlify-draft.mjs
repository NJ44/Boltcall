import fs from 'node:fs/promises';
import path from 'node:path';
import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
import { sha256 } from './release-control.mjs';
import { NETLIFY_CLI_VERSION } from './release-functions.mjs';

const DEPLOY_SITE_SHA256 = '8919cda6c5e1dd8d438c5db99d636ec53c4282d745b0dbfe9a0072847aed2473';

export function assertDraftArguments(args) {
  if (args[0] !== 'deploy') throw Error('Only an explicit prepared draft deploy is allowed');
  const flags = new Set();
  for (let index = 1; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--message' && typeof args[index + 1] === 'string') { index++; continue; }
    if (['--draft', '--no-build', '--dir=dist', '--functions=.netlify-fn-build', '--timeout=600', '--json'].includes(arg)) { flags.add(arg); continue; }
    if (arg.startsWith('--cwd=') && path.isAbsolute(arg.slice(6))) continue;
    throw Error('Unexpected draft CLI argument');
  }
  if (!flags.has('--draft') || !flags.has('--no-build')) throw Error('Only an explicit prepared draft deploy is allowed');
}

export function draftOnlySource(source) {
  if (sha256(source) !== DEPLOY_SITE_SHA256) throw Error('Unexpected Netlify deploy module hash');
  const original = source.toString()
    .replace('deployTimeout = DEFAULT_DEPLOY_TIMEOUT, draft = false,', 'deployTimeout = DEFAULT_DEPLOY_TIMEOUT, draft = true,')
    .replace('export const deploySite = async', 'const deploySiteImplementation = async');
  const diagnosticModule = JSON.stringify(new URL('./release-diagnostics.mjs', import.meta.url).href);
  return `import { reportNetlifyFailure } from ${diagnosticModule};\n${original}\n` +
    'export const deploySite = async (...args) => { try { return await deploySiteImplementation(...args); } catch (error) { reportNetlifyFailure(error); throw error; } };\n';
}

export async function runDraftCLI(args, cliRoot = process.env.NETLIFY_CLI_ROOT) {
  assertDraftArguments(args);
  if (!cliRoot) throw Error('Pinned NETLIFY_CLI_ROOT is required');
  const root = await fs.realpath(cliRoot);
  const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json')));
  if (pkg.name !== 'netlify-cli' || pkg.version !== NETLIFY_CLI_VERSION) throw Error('Unexpected Netlify CLI version');
  const target = pathToFileURL(path.join(root, 'dist/utils/deploy/deploy-site.js')).href;
  draftOnlySource(await fs.readFile(new URL(target)));
  // CLI 26.2.0 creates a draft but omits draft when finalizing that same ID.
  // Its official PUT schema accepts draft too. Change only this pinned module
  // in this child process, before any CLI code or network operation can run.
  registerHooks({ load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    return url === target ? { ...result, source: draftOnlySource(result.source) } : result;
  } });
  const entry = path.join(root, 'bin/run.js');
  process.argv = [process.execPath, entry, ...args];
  await import(pathToFileURL(entry));
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  await runDraftCLI(process.argv.slice(2));
}
