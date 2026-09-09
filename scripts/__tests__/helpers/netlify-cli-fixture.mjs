import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { SITE_ID, sha256 } from '../../release-control.mjs';
import { command } from '../../release-workflow.mjs';

// Exercise the actual CLI through the production draft wrapper. Its outbound API
// is a loopback server; a preload blocks non-loopback HTTP/fetch destinations.
export async function withNetlifyCLI({ root, cliRoot, uploadFailure }, operation) {
  const guard = path.join(root, 'network-guard.mjs');
  await fs.writeFile(guard, `import http from 'node:http';import https from 'node:https';import {syncBuiltinESMExports} from 'node:module';
    function allow(input){const host=typeof input==='string'?new URL(input).hostname:input instanceof URL?input.hostname:input.hostname||input.host||'localhost';if(!['localhost','127.0.0.1'].includes(host.split(':')[0]))throw Error('Nonlocal test network blocked');}
    for(const module of [http,https])for(const key of ['request','get']){const original=module[key];module[key]=function(input,...rest){allow(input);return original.call(this,input,...rest)}}
    const originalFetch=globalThis.fetch;globalThis.fetch=(input,...rest)=>{allow(typeof input==='object'&&input.url?input.url:input);return originalFetch(input,...rest)};syncBuiltinESMExports();`);
  const deployId = 'f'.repeat(24);
  const site = { id: SITE_ID, name: 'fixture-site', account_id: 'fixture-account', account_slug: 'fixture',
    url: 'https://fixture.invalid', ssl_url: 'https://fixture.invalid', build_settings: {}, feature_flags: {}, capabilities: {}, processing_settings: {} };
  const observed = { creates: [], updates: [], uploads: [], fileUploads: [], cancellations: [], unexpected: [] };
  let requiredFunctions = [], requiredFiles = [];
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bytes = Buffer.concat(chunks), url = new URL(req.url, 'http://localhost');
    let body, result;
    try { body = JSON.parse(bytes); } catch { /* Function requests contain ZIP bytes. */ }
    if (url.pathname.endsWith(`/sites/${SITE_ID}`)) result = site;
    else if (url.pathname.endsWith('/sites')) result = [{ ...site, name: url.searchParams.get('name') || site.name }];
    else if (url.pathname.endsWith('/accounts')) result = [{ id: 'fixture-account', slug: 'fixture', capabilities: {} }];
    else if (url.pathname.includes('/env') || url.pathname.endsWith('/plugins') || url.pathname.includes('/extensions')) result = [];
    else if (url.pathname.endsWith('/user')) result = { id: 'fixture-user', email: 'fixture@example.invalid' };
    else if (req.method === 'POST' && url.pathname.endsWith('/deploys')) {
      observed.creates.push(body);
      result = { ...site, id: deployId, site_id: SITE_ID };
    } else if (req.method === 'PUT' && body?.functions) {
      observed.updates.push(body);
      requiredFunctions = Object.values(body.functions);
      requiredFiles = [...new Set(Object.values(body.files))];
      result = { id: deployId, site_id: SITE_ID, required: requiredFiles, required_functions: requiredFunctions };
    } else if (req.method === 'PUT' && url.pathname.includes('/files/')) {
      const digest = createHash('sha1').update(bytes).digest('hex');
      observed.fileUploads.push({ name: decodeURI(url.pathname.split('/files/')[1]), digest });
      requiredFiles = requiredFiles.filter(value => value !== digest);
      result = {};
    } else if (req.method === 'PUT' && url.pathname.includes('/functions/')) {
      observed.uploads.push({ name: url.pathname.split('/').at(-1), parameters: Object.fromEntries(url.searchParams), digest: sha256(bytes) });
      if (uploadFailure) { res.writeHead(uploadFailure.status, { 'content-type': 'application/json' }).end(JSON.stringify({ message: uploadFailure.message, code: uploadFailure.code, ...uploadFailure.extra })); return; }
      requiredFunctions = requiredFunctions.filter(digest => digest !== sha256(bytes));
      result = {};
    } else if (req.method === 'POST' && url.pathname.endsWith(`/deploys/${deployId}/cancel`)) {
      observed.cancellations.push(deployId);
      result = { id: deployId, state: 'error', error_message: 'Deploy canceled' };
    } else if (req.method === 'GET' && url.pathname.includes('/deploys/')) {
      result = { id: deployId, site_id: SITE_ID, state: 'ready', url: site.url, ssl_url: site.ssl_url,
        deploy_url: `https://${deployId}--boltcall.netlify.app`, deploy_ssl_url: `https://${deployId}--boltcall.netlify.app`,
        admin_url: 'https://fixture.invalid', required: requiredFiles, required_functions: requiredFunctions };
    } else {
      observed.unexpected.push(`${req.method} ${url.pathname}`);
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(result));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  // Deliberately exclude inherited credentials, proxies and NODE_OPTIONS.
  const env = Object.fromEntries(Object.entries({ PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, TEMP: process.env.TEMP, TMP: process.env.TMP,
    APPDATA: path.join(root, 'appdata'), LOCALAPPDATA: path.join(root, 'localappdata'), USERPROFILE: root, HOME: root, CI: 'true',
    NETLIFY_AUTH_TOKEN: 'fixture-token', NETLIFY_SITE_ID: SITE_ID, NETLIFY_API_URL: `http://127.0.0.1:${server.address().port}/api/v1` }).filter(([, value]) => value !== undefined));
  try {
    return await operation({ observed, run: async (bin, args, options) => {
      if (bin !== process.execPath || !args[0].endsWith('netlify-draft.mjs')) throw Error('Unexpected CLI command');
      return command(process.execPath, ['--import', pathToFileURL(guard).href, ...args],
        { ...options, env: { ...env, CONTEXT: options.env.CONTEXT, NETLIFY_CLI_ROOT: cliRoot }, timeout: 120000, maxBuffer: 2000000, windowsHide: true });
    } });
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
