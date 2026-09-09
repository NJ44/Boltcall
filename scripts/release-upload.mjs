import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { SITE_ID, sha256, assertNetlifySite } from './release-control.mjs';

export const DEPLOY_ID = /^[a-f0-9]{24}$/;
export const readDeploymentReceipt = async (file = 'deployment-receipt.json') => JSON.parse(await fs.readFile(file));
export async function saveDeploymentReceipt(value, file = 'deployment-receipt.json') {
  const temporary = `${file}.${randomUUID()}.tmp`;
  const handle = await fs.open(temporary, 'wx', 0o600);
  try { await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`); await handle.sync(); }
  finally { await handle.close(); }
  try { await fs.rename(temporary, file); }
  finally { await fs.unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
}
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().filter(key => value[key] !== undefined).map(key => [key, canonical(value[key])])) : value;
export const fingerprint = value => sha256(JSON.stringify(canonical(value)));

export function assertProductionPointer(site, expectedId) {
  assertNetlifySite(site);
  if (!DEPLOY_ID.test(expectedId || '') || site.published_deploy?.id !== expectedId) throw Error('Production changed during the release');
  if (site.published_deploy.locked === true) throw Error('Production deployment is locked');
}

export async function guardPreparedUpload(args, operation, { mode = process.env.BOLTCALL_RELEASE_MODE,
  file = process.env.BOLTCALL_RELEASE_STATE } = {}) {
  const [, api, siteId, , options] = args;
  if (!['preview', 'production'].includes(mode) || !path.isAbsolute(file || '') || path.basename(file) !== 'deployment-receipt.json' ||
      siteId !== SITE_ID || !DEPLOY_ID.test(options?.deployId || '')) throw Error('Invalid guarded upload identity');
  let receipt = await readDeploymentReceipt(file);
  if (receipt.site_id !== SITE_ID || receipt.stage !== `${mode}_requested` || !DEPLOY_ID.test(receipt.previous_deploy_id || '') ||
      options.deployId === receipt.previous_deploy_id || options.deployId === receipt.preview_deploy_id ||
      (mode === 'production' && (!DEPLOY_ID.test(receipt.preview_deploy_id || '') || !/^[a-f0-9]{64}$/.test(receipt.upload_fingerprint || '')))) throw Error('Upload receipt cannot be reused or changed');
  receipt = { ...receipt, stage: `${mode}_started`, [`${mode}_deploy_id`]: options.deployId };
  await saveDeploymentReceipt(receipt, file);
  const originalUpdate = api.updateSiteDeploy;
  let finalized = false;
  api.updateSiteDeploy = async parameters => {
    if (finalized || parameters.siteId !== SITE_ID || parameters.deploy_id !== options.deployId || parameters.body?.draft !== (mode === 'preview')) throw Error('Unexpected upload finalization');
    const { files, functions, functions_config, function_schedules } = parameters.body;
    if (!files || !functions || Object.keys(files).length === 0 || Object.keys(functions).length === 0) throw Error('Missing prepared upload maps');
    const manifest = JSON.parse(await fs.readFile(options.manifestPath));
    const runtime = manifest.functions.map(({ name, runtime, runtimeVersion, invocationMode, buildData, timeout, schedule }) =>
      ({ name, runtime, runtimeVersion, invocationMode, buildData, timeout, schedule }));
    const digest = fingerprint({ files, functions, functions_config, function_schedules, runtime });
    if (mode === 'production' && digest !== receipt.upload_fingerprint) throw Error('Production upload differs from the verified preview');
    assertProductionPointer(await api.getSite({ siteId: SITE_ID }), receipt.previous_deploy_id);
    finalized = true;
    receipt = { ...receipt, stage: `${mode}_finalizing`, upload_fingerprint: digest, file_count: Object.keys(files).length, function_count: Object.keys(functions).length };
    await saveDeploymentReceipt(receipt, file);
    return originalUpdate.call(api, parameters);
  };
  try { return await operation(...args); }
  finally { api.updateSiteDeploy = originalUpdate; }
}
