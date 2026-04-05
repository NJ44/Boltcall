/**
 * Callbacks Service — CRUD, filtering, scheduling, stats.
 * Mocks Supabase client to test business logic.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Proxy-based Supabase chain mock
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
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_1' } } }),
  },
  from: vi.fn(),
}));

vi.mock('../supabase', () => ({ supabase: mockSupabase }));

import { CallbackService } from '../callbacks';

describe('CallbackService — Create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.from.mockReturnValue(createChainMock());
  });

  it('createCallback inserts into callbacks table', async () => {
    const mockCallback = { id: 'cb_1', client_name: 'John', status: 'pending' };
    mockSupabase.from.mockReturnValue(createChainMock(mockCallback));

    const result = await CallbackService.createCallback({
      client_name: 'John',
      client_phone: '+1234567890',
      source: 'phone',
    } as any);

    expect(mockSupabase.from).toHaveBeenCalledWith('callbacks');
    expect(result).toEqual(mockCallback);
  });

  it('createCallback throws on Supabase error', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { message: 'Insert failed' })
    );

    await expect(
      CallbackService.createCallback({ client_name: 'Test' } as any)
    ).rejects.toThrow('Failed to create callback');
  });
});

describe('CallbackService — Read', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getCallbacks returns array of callbacks', async () => {
    const mockCallbacks = [
      { id: 'cb_1', status: 'pending' },
      { id: 'cb_2', status: 'completed' },
    ];
    mockSupabase.from.mockReturnValue(createChainMock(mockCallbacks));

    const result = await CallbackService.getCallbacks();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('cb_1');
  });

  it('getCallbacks returns empty array when data is null', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null));

    const result = await CallbackService.getCallbacks();
    expect(result).toEqual([]);
  });

  it('getCallbackById returns single callback', async () => {
    const mockCb = { id: 'cb_1', client_name: 'John' };
    mockSupabase.from.mockReturnValue(createChainMock(mockCb));

    const result = await CallbackService.getCallbackById('cb_1');
    expect(result?.id).toBe('cb_1');
  });

  it('getCallbackById returns null for not found (PGRST116)', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { code: 'PGRST116', message: 'Not found' })
    );

    const result = await CallbackService.getCallbackById('missing');
    expect(result).toBeNull();
  });

  it('getCallbacksByLeadId queries by lead_id', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([]));

    await CallbackService.getCallbacksByLeadId('lead_1');
    expect(mockSupabase.from).toHaveBeenCalledWith('callbacks');
  });

  it('getCallbacksByAgent queries by assigned_agent_id', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([]));

    await CallbackService.getCallbacksByAgent('agent_1');
    expect(mockSupabase.from).toHaveBeenCalledWith('callbacks');
  });

  it('getPendingCallbacks filters by pending status', async () => {
    const pending = [{ id: 'cb_1', status: 'pending' }];
    mockSupabase.from.mockReturnValue(createChainMock(pending));

    const result = await CallbackService.getPendingCallbacks();
    expect(result).toHaveLength(1);
  });

  it('getScheduledCallbacks queries date range', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([]));

    await CallbackService.getScheduledCallbacks('2026-04-01', '2026-04-30');
    expect(mockSupabase.from).toHaveBeenCalledWith('callbacks');
  });
});

describe('CallbackService — Update', () => {
  beforeEach(() => vi.clearAllMocks());

  it('updateCallback sends update to Supabase', async () => {
    const updated = { id: 'cb_1', status: 'scheduled' };
    mockSupabase.from.mockReturnValue(createChainMock(updated));

    const result = await CallbackService.updateCallback('cb_1', { status: 'scheduled' } as any);
    expect(result.status).toBe('scheduled');
  });

  it('markCallbackCompleted sets status, outcome, completed_at', async () => {
    const completed = { id: 'cb_1', status: 'completed', outcome: 'successful' };
    mockSupabase.from.mockReturnValue(createChainMock(completed));

    const result = await CallbackService.markCallbackCompleted('cb_1', 'successful', 'Patient booked');
    expect(result.status).toBe('completed');
  });

  it('scheduleCallback sets status to scheduled with time', async () => {
    const scheduled = { id: 'cb_1', status: 'scheduled', scheduled_at: '2026-04-10T10:00:00Z' };
    mockSupabase.from.mockReturnValue(createChainMock(scheduled));

    const result = await CallbackService.scheduleCallback('cb_1', '2026-04-10T10:00:00Z', 'agent_1');
    expect(result.status).toBe('scheduled');
  });

  it('recordCallbackAttempt increments attempt_count', async () => {
    // First call: getCallbackById
    const existingCb = { id: 'cb_1', attempt_count: 2, status: 'pending' };
    mockSupabase.from
      .mockReturnValueOnce(createChainMock(existingCb)) // getCallbackById
      .mockReturnValueOnce(createChainMock({ ...existingCb, attempt_count: 3 })); // updateCallback

    const result = await CallbackService.recordCallbackAttempt('cb_1', 'no_answer', 'No pick up');
    expect(result.attempt_count).toBe(3);
  });

  it('recordCallbackAttempt throws if callback not found', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { code: 'PGRST116', message: 'Not found' })
    );

    await expect(
      CallbackService.recordCallbackAttempt('missing', 'no_answer')
    ).rejects.toThrow('Callback not found');
  });
});

describe('CallbackService — Delete', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deleteCallback removes from Supabase', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null));

    await CallbackService.deleteCallback('cb_1');
    expect(mockSupabase.from).toHaveBeenCalledWith('callbacks');
  });

  it('deleteCallback throws on error', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { message: 'Delete failed' })
    );

    await expect(CallbackService.deleteCallback('cb_1')).rejects.toThrow('Failed to delete callback');
  });
});

describe('CallbackService — Stats', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getCallbackStats computes correct aggregates', async () => {
    const callbacks = [
      { status: 'pending', urgency: 'urgent', outcome: null, attempt_count: 0 },
      { status: 'pending', urgency: 'normal', outcome: null, attempt_count: 1 },
      { status: 'completed', urgency: 'normal', outcome: 'successful', attempt_count: 2 },
      { status: 'completed', urgency: 'low', outcome: 'successful', attempt_count: 1 },
      { status: 'scheduled', urgency: 'urgent', outcome: null, attempt_count: 0 },
      { status: 'cancelled', urgency: 'low', outcome: 'not_interested', attempt_count: 3 },
      { status: 'no_answer', urgency: 'normal', outcome: 'no_answer', attempt_count: 2 },
    ];
    mockSupabase.from.mockReturnValue(createChainMock(callbacks));

    const stats = await CallbackService.getCallbackStats();

    expect(stats.total).toBe(7);
    expect(stats.pending).toBe(2);
    expect(stats.completed).toBe(2);
    expect(stats.scheduled).toBe(1);
    expect(stats.cancelled).toBe(1);
    expect(stats.no_answer).toBe(1);

    expect(stats.by_urgency.urgent).toBe(2);
    expect(stats.by_urgency.normal).toBe(3);
    expect(stats.by_urgency.low).toBe(2);

    expect(stats.by_outcome.successful).toBe(2);
    expect(stats.by_outcome.not_interested).toBe(1);
    expect(stats.by_outcome.no_answer).toBe(1);

    // Average attempts: (0+1+2+1+0+3+2) / 7 = 9/7 ≈ 1.2857
    expect(stats.average_attempts).toBeCloseTo(9 / 7, 2);
    // Completion rate: 2/7 * 100 ≈ 28.57%
    expect(stats.completion_rate).toBeCloseTo((2 / 7) * 100, 2);
  });

  it('getCallbackStats returns zeros for empty data', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null));

    const stats = await CallbackService.getCallbackStats();
    expect(stats.total).toBe(0);
    expect(stats.average_attempts).toBe(0);
    expect(stats.completion_rate).toBe(0);
  });
});
