import { describe, it, expect, vi } from 'vitest';
import { runVerifiedRelease } from '../release-workflow.mjs';
import { SITE_ID, PRODUCTION_URL } from '../release-control.mjs';

function fixture(failure, candidate = { state: 'preparing', published_at: null }) {
  const previous = 'a'.repeat(24), preview = 'b'.repeat(24), production = 'c'.repeat(24);
  let current = previous, state;
  const saved = [], phases = [];
  const receipt = { schema_version: 1, project_id: 'boltcall', sha: 'd'.repeat(40), release_id: 'release-fixture', manifest_hash: 'e'.repeat(64),
    request_id: 'request-fixture', run_id: 1, run_attempt: 1, site_id: SITE_ID, production_url: PRODUCTION_URL };
  const functions = [{ name: 'fixture', digest: 'f'.repeat(64), runtime: 'nodejs22.x', invocationMode: 'stream', buildData: { runtimeAPIVersion: 2 }, schedule: '@hourly' }];
  const metadata = { available_functions: [{ n: 'fixture', d: functions[0].digest, r: 'nodejs22.x', im: 'stream', bd: { runtimeAPIVersion: 2 } }], function_schedules: [{ name: 'fixture', cron: '@hourly' }] };
  const api = vi.fn(async (endpoint, options) => {
    if (endpoint === `sites/${SITE_ID}`) return { id: SITE_ID, ssl_url: PRODUCTION_URL, build_settings: { stop_builds: true }, published_deploy: { id: current, locked: failure === 'locked' } };
    if (endpoint.startsWith('deploys/')) {
      const id = endpoint.split('/')[1];
      const result = { ...structuredClone(metadata), id, site_id: SITE_ID, state: 'ready', context: id === preview ? 'deploy-preview' : 'production',
        published_at: id === preview ? null : '2026-09-09T00:00:00Z', deploy_ssl_url: `https://${id}--boltcall.netlify.app` };
      if (failure === 'preview context' && id === preview) result.context = 'production';
      if (failure === 'preview published' && id === preview) result.published_at = '2026-09-09T00:00:00Z';
      if (failure === 'preview URL' && id === preview) result.deploy_ssl_url = 'https://other.invalid';
      if (failure === 'production context' && id === production) result.context = 'deploy-preview';
      if (failure === 'production metadata' && id === production) result.available_functions[0].im = null;
      if (failure === 'lost finalization response' && id === production) Object.assign(result, candidate);
      return result;
    }
    if (endpoint === `sites/${SITE_ID}/deploys/${previous}/restore` && options?.method === 'POST') {
      if (failure === 'lost restore response') throw Error('Restore response lost');
      current = previous;
      return { id: previous, site_id: SITE_ID };
    }
    throw Error('Unexpected API operation');
  });
  const fetchResponse = vi.fn(async url => url.endsWith('/release.json') ? { ok: true, headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ((failure === 'preview marker' && url.includes(preview)) || (failure === 'production marker' && current === production)) ? { ...receipt, manifest_hash: 'bad' } : receipt } :
    { status: (failure === 'preview smoke' && url.includes(preview)) || (current === production && ['production smoke', 'lost restore response'].includes(failure)) ? 502 : 401 });
  const saveReceipt = async value => { state = structuredClone(value); saved.push(state); };
  const upload = vi.fn(async ({ mode }) => {
    phases.push(mode);
    if (failure === 'missing production ID' && mode === 'production') throw Error('Creation response lost');
    const id = mode === 'preview' ? preview : production;
    await saveReceipt({ ...state, stage: `${mode}_started`, [`${mode}_deploy_id`]: id });
    if (failure === 'production upload' && mode === 'production') throw Error('Upload rejected');
    await saveReceipt({ ...state, stage: `${mode}_finalizing`, upload_fingerprint: '1'.repeat(64) });
    if (failure === 'lost finalization response' && mode === 'production') throw Error('Finalization response lost; best-effort cancellation also lost');
    if (mode === 'production') current = failure === 'other deploy' ? '9'.repeat(24) : production;
    return { result: { site_id: SITE_ID, deploy_id: id }, functions, cachePath: '/fixture/cache.json' };
  });
  return { api, saved, phases, upload, publishedId: () => current, publishCandidate: () => { current = production; },
    options: { receipt, previousDeployId: previous, directory: '/fixture', api, fetchResponse, saveReceipt,
    loadReceipt: async () => structuredClone(state), upload } };
}

describe('preview then normal production upload', () => {
  it('verifies preview before a distinct production upload and never restores on success', async () => {
    const f = fixture();
    const result = await runVerifiedRelease(f.options);
    expect(f.phases).toEqual(['preview', 'production']);
    expect(result.stage).toBe('published');
    expect(result.deploy_id).toBe('c'.repeat(24));
    expect(result.preview_deploy_id).toBe('b'.repeat(24));
    expect(f.saved.map(x => x.stage)).toContain('preview_verified');
    expect(f.api.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  });
  it.each(['locked', 'preview context', 'preview published', 'preview URL', 'preview marker', 'preview smoke'])('never starts production when %s is invalid', async failure => {
    const f = fixture(failure);
    await expect(runVerifiedRelease(f.options)).rejects.toThrow();
    expect(f.phases).not.toContain('production');
    expect(f.api.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  });
  it.each(['production context', 'production metadata', 'production smoke', 'production marker'])('restores exactly once when its own published production fails %s', async failure => {
    const f = fixture(failure);
    await expect(runVerifiedRelease(f.options)).rejects.toThrow();
    expect(f.saved.at(-1).stage).toBe('restored');
    expect(f.api.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(1);
  });
  it.each(['production upload', 'other deploy', 'missing production ID'])('does not restore when %s leaves another production pointer', async failure => {
    const f = fixture(failure);
    await expect(runVerifiedRelease(f.options)).rejects.toThrow();
    expect(f.api.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
    if (failure !== 'production upload') expect(f.saved.at(-1).stage).toBe('production_uncertain');
  });
  it('retains restoration uncertainty and never repeats the restore request', async () => {
    const f = fixture('lost restore response');
    await expect(runVerifiedRelease(f.options)).rejects.toThrow();
    expect(f.saved.at(-1).stage).toBe('restoration_requested');
    expect(f.api.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(1);
  });
  it('keeps a preparing candidate uncertain after finalization and cancellation responses are lost', async () => {
    const f = fixture('lost finalization response');
    await expect(runVerifiedRelease(f.options)).rejects.toThrow('Finalization response lost');
    expect(f.saved.at(-1).stage).toBe('production_uncertain');
    expect(f.api).toHaveBeenCalledWith(`deploys/${'c'.repeat(24)}`);
    expect(f.publishedId()).toBe('a'.repeat(24));
    f.publishCandidate(); // Accepted server-side work can complete after recovery returns.
    expect(f.publishedId()).toBe('c'.repeat(24));
    expect(f.saved.at(-1).stage).toBe('production_uncertain');
    expect(f.phases).toEqual(['preview', 'production']);
    expect(f.api.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  });
  it('records failure only after confirming the exact candidate is terminal and unpublished', async () => {
    const f = fixture('lost finalization response', { state: 'error', published_at: null, error_message: 'Deploy canceled' });
    await expect(runVerifiedRelease(f.options)).rejects.toThrow('Finalization response lost');
    expect(f.saved.at(-1).stage).toBe('production_failed');
    expect(f.api).toHaveBeenCalledWith(`deploys/${'c'.repeat(24)}`);
    expect(f.phases).toEqual(['preview', 'production']);
    expect(f.api.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  });
  it.each([
    ['ready', { state: 'ready', published_at: null }],
    ['unconfirmed cancellation', { state: 'preparing', published_at: null, error_message: 'Deploy canceled' }],
    ['missing publication state', { state: 'error', published_at: undefined }],
    ['previously published', { state: 'error', published_at: '2026-09-09T00:00:00Z' }],
    ['different ID', { id: '9'.repeat(24), state: 'error', published_at: null }],
    ['different site', { site_id: 'other', state: 'error', published_at: null }],
    ['different context', { context: 'deploy-preview', state: 'error', published_at: null }],
  ])('keeps the request uncertain when the candidate is %s', async (_, candidate) => {
    const f = fixture('lost finalization response', candidate);
    await expect(runVerifiedRelease(f.options)).rejects.toThrow('Finalization response lost');
    expect(f.saved.at(-1).stage).toBe('production_uncertain');
    expect(f.phases).toEqual(['preview', 'production']);
    expect(f.api.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  });
  it('keeps uncertainty when the exact candidate cannot be read', async () => {
    const f = fixture('lost finalization response'), api = f.options.api;
    f.options.api = vi.fn(async (endpoint, options) => {
      if (endpoint === `deploys/${'c'.repeat(24)}`) throw Error('Candidate response lost');
      return api(endpoint, options);
    });
    await expect(runVerifiedRelease(f.options)).rejects.toThrow('Candidate response lost');
    expect(f.saved.at(-1).stage).toBe('production_uncertain');
    expect(f.phases).toEqual(['preview', 'production']);
    expect(f.api.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  });
  it('restores once if the accepted candidate becomes current during bounded reconciliation', async () => {
    const f = fixture('lost finalization response'), api = f.options.api;
    f.options.api = vi.fn(async (endpoint, options) => {
      const response = await api(endpoint, options);
      if (endpoint === `deploys/${'c'.repeat(24)}`) f.publishCandidate();
      return response;
    });
    await expect(runVerifiedRelease(f.options)).rejects.toThrow('Finalization response lost');
    expect(f.saved.at(-1).stage).toBe('restored');
    expect(f.publishedId()).toBe('a'.repeat(24));
    expect(f.phases).toEqual(['preview', 'production']);
    expect(f.api.mock.calls.filter(([endpoint]) => endpoint === `deploys/${'c'.repeat(24)}`)).toHaveLength(1);
    expect(f.api.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(1);
  });
  it('refuses an existing request receipt before any reads or uploads', async () => {
    const f = fixture();
    await expect(runVerifiedRelease({ ...f.options, receipt: { ...f.options.receipt, stage: 'production_requested' } })).rejects.toThrow();
    expect(f.api).not.toHaveBeenCalled();
    expect(f.upload).not.toHaveBeenCalled();
  });
});
