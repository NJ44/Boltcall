import { describe, it, expect, vi } from 'vitest';
import { verifyAndPromoteDraft } from '../release-workflow.mjs';
import { SITE_ID, PRODUCTION_URL } from '../release-control.mjs';

function fixture(failure) {
  const previousDeployId = 'a'.repeat(24), deployId = 'b'.repeat(24);
  const receipt = { schema_version: 1, project_id: 'boltcall', sha: 'c'.repeat(40), release_id: 'release-fixture',
    manifest_hash: 'd'.repeat(64), request_id: 'request-fixture', run_id: 1, run_attempt: 1, site_id: SITE_ID,
    deploy_id: deployId, production_url: PRODUCTION_URL };
  const functions = [{ name: 'fixture', digest: 'e'.repeat(64), runtime: 'nodejs22.x', invocationMode: 'stream',
    buildData: { runtimeAPIVersion: 2, bootstrapVersion: '2.16.0' }, schedule: '0 6 * * *' }];
  const deploy = { id: deployId, site_id: SITE_ID, state: 'ready', context: 'production', published_at: null,
    deploy_ssl_url: `https://${deployId}--boltcall.netlify.app`, available_functions: [{ n: 'fixture', d: functions[0].digest,
      r: 'nodejs22.x', im: 'stream', bd: functions[0].buildData }], function_schedules: [{ name: 'fixture', cron: '0 6 * * *' }] };
  if (failure === 'runtime') deploy.available_functions[0].r = 'nodejs24.x';
  if (failure === 'stream') delete deploy.available_functions[0].im;
  if (failure === 'build metadata') deploy.available_functions[0].bd = null;
  if (failure === 'digest') deploy.available_functions[0].d = 'f'.repeat(64);
  if (failure === 'schedules') deploy.function_schedules = [];
  if (failure === 'inventory') deploy.available_functions = [];
  if (failure === 'context') deploy.context = 'deploy-preview';
  if (failure === 'already published') deploy.published_at = '2026-09-09T00:00:00Z';
  if (failure === 'preview URL') deploy.deploy_ssl_url = 'https://elsewhere.invalid';
  const saved = [];
  const api = vi.fn(async (endpoint, options) => {
    if (endpoint === `deploys/${deployId}`) return deploy;
    if (endpoint === `sites/${SITE_ID}`) return { id: SITE_ID, ssl_url: PRODUCTION_URL,
      build_settings: { stop_builds: failure !== 'Git builds' }, published_deploy: { id: failure === 'production changed' ? 'f'.repeat(24) : previousDeployId } };
    if (endpoint === `sites/${SITE_ID}/deploys/${deployId}/restore` && options?.method === 'POST') {
      if (failure === 'lost promotion response') throw Error('Promotion response lost');
      return { id: deployId, site_id: SITE_ID };
    }
    throw Error(`Unexpected request ${endpoint}`);
  });
  const fetchResponse = vi.fn(async url => {
    if (url.endsWith('/release.json')) return { ok: true, headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => failure === 'marker' ? { ...receipt, manifest_hash: '0'.repeat(64) } : receipt };
    const name = url.split('/').at(-1);
    return { status: failure === name ? 502 : 401 };
  });
  return { api, fetchResponse, saved, options: { receipt, functions, previousDeployId, api, fetchResponse,
    saveReceipt: async value => { saved.push(structuredClone(value)); } } };
}

describe('draft verification and exact-ID promotion', () => {
  it('retains the draft, verifies all three functions, then promotes only that deploy ID', async () => {
    const { api, fetchResponse, saved, options } = fixture();
    const result = await verifyAndPromoteDraft(options);
    expect(saved.map(r => r.stage)).toEqual(['draft', 'promotion_requested', 'published']);
    expect(result.deploy_id).toBe(options.receipt.deploy_id);
    expect(api.mock.calls.filter(([, opts]) => opts?.method)).toEqual([
      [`sites/${SITE_ID}/deploys/${options.receipt.deploy_id}/restore`, { method: 'POST' }],
    ]);
    expect(fetchResponse.mock.calls.map(([url]) => url.split('/').at(-1))).toEqual(['release.json', 'saas-v2-leads', 'saas-v2-calls', 'retell-agents']);
    expect(fetchResponse.mock.calls.every(([url, opts]) => url.startsWith(`https://${options.receipt.deploy_id}--boltcall.netlify.app/`) && !opts.headers?.Authorization)).toBe(true);
    expect(api.mock.calls.at(-2)[0]).toBe(`sites/${SITE_ID}`);
  });
  it.each(['runtime', 'stream', 'build metadata', 'digest', 'schedules', 'inventory', 'context', 'already published', 'preview URL',
    'marker', 'saas-v2-leads', 'saas-v2-calls', 'retell-agents', 'production changed', 'Git builds'])('retains the draft and makes no publish request when %s validation fails', async failure => {
    const { api, saved, options } = fixture(failure);
    await expect(verifyAndPromoteDraft(options)).rejects.toThrow();
    expect(api.mock.calls.some(([, opts]) => opts?.method === 'POST')).toBe(false);
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ stage: 'draft', deploy_id: options.receipt.deploy_id, previous_deploy_id: options.previousDeployId });
  });
  it('persists an uncertain promotion before the request and never repeats the write', async () => {
    const { api, saved, options } = fixture('lost promotion response');
    await expect(verifyAndPromoteDraft(options)).rejects.toThrow('Promotion response lost');
    expect(saved.map(r => r.stage)).toEqual(['draft', 'promotion_requested']);
    expect(api.mock.calls.filter(([, opts]) => opts?.method === 'POST')).toHaveLength(1);
  });
  it('refuses a receipt with an unsafe target before contacting Netlify', async () => {
    const { api, options } = fixture();
    await expect(verifyAndPromoteDraft({ ...options, receipt: { ...options.receipt, deploy_id: '../other' } })).rejects.toThrow(/target/);
    expect(api).not.toHaveBeenCalled();
  });
  it.each(['draft', 'promotion_requested', 'published'])('refuses reuse of an existing %s receipt before contacting Netlify', async stage => {
    const { api, options, saved } = fixture();
    await expect(verifyAndPromoteDraft({ ...options, receipt: { ...options.receipt, stage } })).rejects.toThrow(/existing deployment receipt/);
    expect(api).not.toHaveBeenCalled();
    expect(saved).toEqual([]);
  });
});
