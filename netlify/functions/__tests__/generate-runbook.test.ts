import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getServiceSupabase, chatCompletion } = vi.hoisted(() => ({
  getServiceSupabase: vi.fn(), chatCompletion: vi.fn(),
}));
vi.mock('../_shared/token-utils', () => ({ getServiceSupabase }));
vi.mock('../_shared/azure-ai', () => ({ chatCompletion }));

import runbook, { testHandler } from '../generate-runbook';

const call = (suffix = '', init: RequestInit = {}) => runbook(new Request(
  `https://boltcall.org/.netlify/functions/generate-runbook${suffix}`, init,
), { params: {} } as never);

describe('generate-runbook modern runtime entry point', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('keeps the legacy handler available for tests without exporting a deployment handler', () => {
    expect(typeof testHandler).toBe('function');
  });

  it.each(['https://boltcall.org', 'https://foreign.example'])('applies strict CORS to preflight from %s', async origin => {
    const response = await call('', { method: 'OPTIONS', headers: { origin } });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('');
    expect(response.headers.get('vary')).toBe('Origin');
    expect(response.headers.get('access-control-allow-origin')).not.toBe('*');
    if (origin === 'https://boltcall.org') expect(response.headers.get('access-control-allow-origin')).toBe(origin);
    else expect(response.headers.get('access-control-allow-origin')).not.toBe(origin);
    expect(getServiceSupabase).not.toHaveBeenCalled();
  });

  it.each([
    ['', {}, 400, 'userId required'],
    ['?userId=user-a', {}, 401, 'Authentication required'],
    ['', { method: 'POST', body: '{' }, 400, 'Invalid JSON'],
    ['', { method: 'POST', body: '{"userId":"user-a"}' }, 401, 'Authentication required'],
    ['', { method: 'DELETE' }, 405, 'Method not allowed'],
  ] as const)('preserves validation and authentication for %s %o', async (suffix, init, status, error) => {
    const response = await call(suffix, init);
    expect(response.status).toBe(status);
    expect(await response.json()).toEqual({ error });
    expect(getServiceSupabase).not.toHaveBeenCalled();
    expect(chatCompletion).not.toHaveBeenCalled();
  });

  it('preserves authenticated GET query handling and user scoping', async () => {
    const row = { id: 'runbook-a', status: 'ready', content_md: '# Instructions' };
    const query = { select: vi.fn(), eq: vi.fn(), order: vi.fn(), limit: vi.fn(), maybeSingle: vi.fn().mockResolvedValue({ data: row, error: null }) };
    for (const method of ['select', 'eq', 'order', 'limit'] as const) query[method].mockReturnValue(query);
    const auth = { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-a' } }, error: null }) };
    const from = vi.fn().mockReturnValue(query);
    getServiceSupabase.mockReturnValue({ auth, from });
    const response = await call('?userId=user-a', { headers: { authorization: 'Bearer fixture-token' } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ runbook: row });
    expect(auth.getUser).toHaveBeenCalledWith('fixture-token');
    expect(from).toHaveBeenCalledWith('customer_runbooks');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-a');
    expect(chatCompletion).not.toHaveBeenCalled();
  });
});
