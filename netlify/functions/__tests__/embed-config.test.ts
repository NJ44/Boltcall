import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

// Set env vars before import
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-key';

import { handler } from '../embed-config';

function makeEvent(overrides: any = {}) {
  return {
    httpMethod: overrides.httpMethod || 'GET',
    headers: overrides.headers || {},
    queryStringParameters: overrides.queryStringParameters || null,
    body: null,
    ...overrides,
  } as any;
}

describe('embed-config function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 for OPTIONS', async () => {
    const res = await handler(makeEvent({ httpMethod: 'OPTIONS' }), {} as any);
    expect(res!.statusCode).toBe(200);
  });

  it('returns 405 for POST', async () => {
    const res = await handler(makeEvent({ httpMethod: 'POST' }), {} as any);
    expect(res!.statusCode).toBe(405);
  });

  it('returns 400 if token parameter missing', async () => {
    const res = await handler(makeEvent({ queryStringParameters: {} }), {} as any);
    expect(res!.statusCode).toBe(400);
    expect(JSON.parse(res!.body!).error).toBe('token parameter required');
  });

  it('returns 400 for invalid token format', async () => {
    const res = await handler(
      makeEvent({ queryStringParameters: { token: 'not-a-hex-token' } }),
      {} as any
    );
    expect(res!.statusCode).toBe(400);
    expect(JSON.parse(res!.body!).error).toBe('Invalid token format');
  });

  it('accepts valid 32-char hex token', async () => {
    const validToken = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';
    mockSingle.mockResolvedValue({
      data: {
        workspace_id: 'ws-1',
        chatbot_enabled: true,
        chatbot_config: { theme: 'dark' },
        speed_to_lead_enabled: false,
        reputation_manager_enabled: false,
      },
      error: null,
    });

    const res = await handler(
      makeEvent({ queryStringParameters: { token: validToken } }),
      {} as any
    );
    expect(res!.statusCode).toBe(200);
    const body = JSON.parse(res!.body!);
    expect(body.workspace_id).toBe('ws-1');
    expect(body.chatbot).toEqual({ theme: 'dark' });
  });

  it('only returns enabled features', async () => {
    const validToken = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';
    mockSingle.mockResolvedValue({
      data: {
        workspace_id: 'ws-2',
        chatbot_enabled: false,
        speed_to_lead_enabled: true,
        speed_to_lead_config: { urgency: 'high' },
        reputation_manager_enabled: true,
        reputation_manager_config: { autoReply: true },
      },
      error: null,
    });

    const res = await handler(
      makeEvent({ queryStringParameters: { token: validToken } }),
      {} as any
    );
    const body = JSON.parse(res!.body!);
    expect(body.chatbot).toBeUndefined();
    expect(body.speed_to_lead).toEqual({ urgency: 'high' });
    expect(body.reputation).toEqual({ autoReply: true });
  });

  it('returns 404 for unknown token', async () => {
    const validToken = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'no rows' },
    });

    const res = await handler(
      makeEvent({ queryStringParameters: { token: validToken } }),
      {} as any
    );
    expect(res!.statusCode).toBe(404);
  });
});
