import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { guardPreparedUpload, saveDeploymentReceipt, readDeploymentReceipt } from '../release-upload.mjs';
import { SITE_ID, PRODUCTION_URL } from '../release-control.mjs';

async function fixture(operation) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'boltcall-upload-guard-'));
  try {
    const file = path.join(root, 'deployment-receipt.json'), manifestPath = path.join(root, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify({ functions: [{ name: 'fn', runtimeVersion: 'nodejs22.x', invocationMode: 'stream', timeout: 300 }] }));
    const api = { getSite: vi.fn(async () => ({ id: SITE_ID, ssl_url: PRODUCTION_URL, build_settings: { stop_builds: true }, published_deploy: { id: 'a'.repeat(24), locked: false } })), updateSiteDeploy: vi.fn(async () => ({})) };
    const body = { files: { 'index.html': '1'.repeat(40), 'netlify.toml': '2'.repeat(40) }, functions: { fn: '3'.repeat(64) },
      functions_config: { fn: { build_data: { runtimeAPIVersion: 2 } } }, function_schedules: [] };
    const invoke = (mode, nextBody = body) => guardPreparedUpload([{}, api, SITE_ID, root, { deployId: (mode === 'preview' ? 'b' : 'c').repeat(24), manifestPath }], async (...args) => {
      const early = await readDeploymentReceipt(file);
      expect(early.stage).toBe(`${mode}_started`);
      expect(early[`${mode}_deploy_id`]).toBe(args[4].deployId);
      return args[1].updateSiteDeploy({ siteId: SITE_ID, deploy_id: args[4].deployId, body: { ...nextBody, draft: mode === 'preview' } });
    }, { mode, file });
    await saveDeploymentReceipt({ site_id: SITE_ID, previous_deploy_id: 'a'.repeat(24), stage: 'preview_requested' }, file);
    await invoke('preview');
    const preview = await readDeploymentReceipt(file);
    await saveDeploymentReceipt({ ...preview, stage: 'production_requested' }, file);
    api.updateSiteDeploy.mockClear();
    await operation({ api, body, invoke, file, manifestPath });
  } finally { await fs.rm(root, { recursive: true, force: true }); }
}
describe('actual upload boundary', () => {
  it('persists early IDs and permits identical full maps', () => fixture(async f => {
    await f.invoke('production');
    expect(f.api.updateSiteDeploy).toHaveBeenCalledOnce();
    expect((await readDeploymentReceipt(f.file)).stage).toBe('production_finalizing');
  }));
  it.each(['static', 'generated config', 'function', 'function metadata', 'runtime'])('refuses changed %s before production finalization', failure => fixture(async f => {
    const body = structuredClone(f.body);
    if (failure === 'static') body.files['index.html'] = '4'.repeat(40);
    if (failure === 'generated config') body.files['netlify.toml'] = '4'.repeat(40);
    if (failure === 'function') body.functions.fn = '4'.repeat(64);
    if (failure === 'function metadata') body.functions_config.fn.build_data.runtimeAPIVersion = 1;
    if (failure === 'runtime') await fs.writeFile(f.manifestPath, JSON.stringify({ functions: [{ name: 'fn', runtimeVersion: 'nodejs24.x' }] }));
    await expect(f.invoke('production', body)).rejects.toThrow(/differs/);
    expect(f.api.updateSiteDeploy).not.toHaveBeenCalled();
    expect((await readDeploymentReceipt(f.file)).production_deploy_id).toBe('c'.repeat(24));
  }));
  it.each(['locked', 'changed'])('refuses %s production before finalizing', failure => fixture(async f => {
    f.api.getSite.mockResolvedValue({ id: SITE_ID, ssl_url: PRODUCTION_URL, build_settings: { stop_builds: true }, published_deploy: { id: (failure === 'changed' ? 'd' : 'a').repeat(24), locked: failure === 'locked' } });
    await expect(f.invoke('production')).rejects.toThrow();
    expect(f.api.updateSiteDeploy).not.toHaveBeenCalled();
  }));
});
