/**
 * Dashboard API — tests for fetchDashboardStats, fetchDailyMetrics,
 * fetchBusinessHealth, fetchCallbackStats, fetchChatStats, fetchLeads.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api', () => ({ FUNCTIONS_BASE: 'http://localhost:8888/.netlify/functions' }));

function createChainMock(resolvedData: any = [], resolvedError: any = null) {
  const resolved = Promise.resolve({ data: resolvedData, error: resolvedError, count: 0 });
  const chain: any = new Proxy({}, {
    get(_target, prop) {
      if (prop === 'then') return resolved.then.bind(resolved);
      if (prop === 'catch') return resolved.catch.bind(resolved);
      if (prop === 'finally') return resolved.finally.bind(resolved);
      if (prop === 'single' || prop === 'maybeSingle') {
        return () => Promise.resolve({ data: resolvedData, error: resolvedError });
      }
      return (..._args: any[]) => chain;
    },
  });
  return chain;
}

const mockSupabase = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'tok_123' } } }),
  },
  from: vi.fn(),
  rpc: vi.fn().mockResolvedValue({ data: { score: 85 }, error: null }),
}));

vi.mock('../supabase', () => ({ supabase: mockSupabase }));

const mockFetch = vi.fn();
global.fetch = mockFetch;

import {
  fetchDashboardStats,
  fetchDailyMetrics,
  fetchBusinessHealth,
  fetchCallbackStats,
  fetchChatStats,
  fetchLeads,
} from '../dashboardApi';

describe('fetchDashboardStats', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('fetches stats with auth header', async () => {
    mockFetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ summary: { ai_calls_today: 5 } }),
    }));

    const result = await fetchDashboardStats();
    expect(result.summary.ai_calls_today).toBe(5);

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('/dashboard-stats');
    expect(opts.headers.Authorization).toBe('Bearer tok_123');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: false, status: 500 }));

    await expect(fetchDashboardStats()).rejects.toThrow('Dashboard stats failed: 500');
  });

  it('throws timeout error on abort', async () => {
    mockFetch.mockImplementation(() => {
      const err = new DOMException('Aborted', 'AbortError');
      return Promise.reject(err);
    });

    await expect(fetchDashboardStats()).rejects.toThrow('Dashboard stats request timed out');
  });
});

describe('fetchDailyMetrics', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('fetches with default 30 day limit', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([
      { date: '2026-04-05', calls: 10, leads: 3 },
    ]));

    const result = await fetchDailyMetrics();
    expect(result).toHaveLength(1);
    expect(mockSupabase.from).toHaveBeenCalledWith('daily_metrics');
  });

  it('fetches with explicit date range', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([]));

    await fetchDailyMetrics(30, { start: '2026-03-01', end: '2026-03-31' });
    expect(mockSupabase.from).toHaveBeenCalledWith('daily_metrics');
  });

  it('returns empty array on error', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null, { message: 'Error' }));

    const result = await fetchDailyMetrics();
    expect(result).toEqual([]);
  });
});

describe('fetchBusinessHealth', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('calls get_business_health RPC', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: { score: 92 }, error: null });

    const result = await fetchBusinessHealth();
    expect(result.score).toBe(92);
    expect(mockSupabase.rpc).toHaveBeenCalledWith('get_business_health');
  });

  it('returns null on RPC error', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: null, error: { message: 'RPC fail' } });

    const result = await fetchBusinessHealth();
    expect(result).toBeNull();
  });
});

describe('fetchCallbackStats', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('aggregates callback statuses', async () => {
    const callbacks = [
      { status: 'pending' },
      { status: 'pending' },
      { status: 'scheduled' },
      { status: 'completed' },
      { status: 'no_answer' },
    ];
    mockSupabase.from.mockReturnValue(createChainMock(callbacks));

    const stats = await fetchCallbackStats();
    expect(stats.total).toBe(5);
    expect(stats.pending).toBe(2);
    expect(stats.scheduled).toBe(1);
    expect(stats.completed).toBe(1);
    expect(stats.no_answer).toBe(1);
  });

  it('returns zeros on error', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null, { message: 'Error' }));

    const stats = await fetchCallbackStats();
    expect(stats.total).toBe(0);
    expect(stats.pending).toBe(0);
  });
});

describe('fetchChatStats', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('aggregates chat statuses', async () => {
    const chats = [
      { status: 'active' },
      { status: 'active' },
      { status: 'closed' },
      { status: 'paused' },
      { status: 'transferred' },
    ];
    mockSupabase.from.mockReturnValue(createChainMock(chats));

    const stats = await fetchChatStats();
    expect(stats.total).toBe(5);
    expect(stats.active).toBe(2);
    expect(stats.closed).toBe(1);
    expect(stats.paused).toBe(1);
    expect(stats.transferred).toBe(1);
  });
});

describe('fetchLeads', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('fetches leads with optional filters', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([{ id: 'l1' }, { id: 'l2' }]));

    const result = await fetchLeads({ status: 'pending', limit: 10 });
    expect(result).toHaveLength(2);
    expect(mockSupabase.from).toHaveBeenCalledWith('callbacks');
  });

  it('returns empty array on error', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null, { message: 'Error' }));

    const result = await fetchLeads();
    expect(result).toEqual([]);
  });
});
