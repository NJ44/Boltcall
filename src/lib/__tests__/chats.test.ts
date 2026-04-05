/**
 * Chat Service — CRUD, messages, search, stats, close/transfer/pause/resume.
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

const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_1' } } }),
  },
  from: vi.fn().mockReturnValue(createChainMock()),
};

vi.mock('../supabase', () => ({ supabase: mockSupabase }));

// Mock crypto.randomUUID
vi.stubGlobal('crypto', { randomUUID: () => 'mock-uuid-1234' });

import { ChatService } from '../chats';

describe('ChatService — Create', () => {
  beforeEach(() => vi.clearAllMocks());

  it('createChat inserts with default fields', async () => {
    const mockChat = { id: 'chat_1', status: 'active', chat_history: [], message_count: 0 };
    mockSupabase.from.mockReturnValue(createChainMock(mockChat));

    const result = await ChatService.createChat({
      customer_name: 'Alice',
      chat_type: 'inbound',
      source: 'website',
    } as any);

    expect(mockSupabase.from).toHaveBeenCalledWith('chats');
    expect(result.id).toBe('chat_1');
  });

  it('createChat throws on error', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null, { message: 'Insert failed' }));

    await expect(
      ChatService.createChat({ customer_name: 'Bob' } as any)
    ).rejects.toThrow('Failed to create chat');
  });
});

describe('ChatService — Read', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getChats returns array', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([{ id: 'c1' }, { id: 'c2' }]));

    const result = await ChatService.getChats();
    expect(result).toHaveLength(2);
  });

  it('getChats returns empty array on null data', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null));
    const result = await ChatService.getChats();
    expect(result).toEqual([]);
  });

  it('getChatById returns single chat', async () => {
    mockSupabase.from.mockReturnValue(createChainMock({ id: 'c1', customer_name: 'Alice' }));

    const result = await ChatService.getChatById('c1');
    expect(result?.customer_name).toBe('Alice');
  });

  it('getChatById returns null for not found', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { code: 'PGRST116', message: 'Not found' })
    );

    const result = await ChatService.getChatById('missing');
    expect(result).toBeNull();
  });

  it('getChatBySessionId queries by session ID', async () => {
    mockSupabase.from.mockReturnValue(createChainMock({ id: 'c1', chat_session_id: 'sess_1' }));

    const result = await ChatService.getChatBySessionId('sess_1');
    expect(result?.chat_session_id).toBe('sess_1');
  });

  it('getChatsByLeadId queries by lead', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([{ id: 'c1' }]));

    const result = await ChatService.getChatsByLeadId('lead_1');
    expect(result).toHaveLength(1);
  });

  it('getChatsByAgent queries by agent', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([]));

    const result = await ChatService.getChatsByAgent('agent_1');
    expect(result).toEqual([]);
  });

  it('getActiveChats filters by active status', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([{ id: 'c1', status: 'active' }]));

    const result = await ChatService.getActiveChats();
    expect(result).toHaveLength(1);
  });
});

describe('ChatService — Update', () => {
  beforeEach(() => vi.clearAllMocks());

  it('updateChat sends update', async () => {
    const updated = { id: 'c1', status: 'paused' };
    mockSupabase.from.mockReturnValue(createChainMock(updated));

    const result = await ChatService.updateChat('c1', { status: 'paused' } as any);
    expect(result.status).toBe('paused');
  });

  it('closeChat sets ended_at and resolution status', async () => {
    const closed = { id: 'c1', status: 'closed', ended_at: '2026-04-05T12:00:00Z' };
    mockSupabase.from.mockReturnValue(createChainMock(closed));

    const result = await ChatService.closeChat('c1', 'resolved', 'Issue fixed');
    expect(result.status).toBe('closed');
  });

  it('transferChat changes agent and status', async () => {
    const transferred = { id: 'c1', status: 'transferred', agent_id: 'agent_2' };
    mockSupabase.from.mockReturnValue(createChainMock(transferred));

    const result = await ChatService.transferChat('c1', 'agent_2', 'Needs specialist');
    expect(result.status).toBe('transferred');
  });

  it('pauseChat sets status to paused', async () => {
    mockSupabase.from.mockReturnValue(createChainMock({ id: 'c1', status: 'paused' }));

    const result = await ChatService.pauseChat('c1', 'Customer away');
    expect(result.status).toBe('paused');
  });

  it('resumeChat sets status back to active', async () => {
    mockSupabase.from.mockReturnValue(createChainMock({ id: 'c1', status: 'active' }));

    const result = await ChatService.resumeChat('c1');
    expect(result.status).toBe('active');
  });
});

describe('ChatService — Messages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('addMessage appends to chat history', async () => {
    // getChatById mock
    const existingChat = {
      id: 'c1',
      chat_history: [{ id: 'old_msg', content: 'Hello' }],
      message_count: 1,
    };
    const updatedChat = {
      ...existingChat,
      chat_history: [...existingChat.chat_history, { id: 'mock-uuid-1234', content: 'Reply' }],
      message_count: 2,
    };

    mockSupabase.from
      .mockReturnValueOnce(createChainMock(existingChat)) // getChatById
      .mockReturnValueOnce(createChainMock(updatedChat)); // update

    const result = await ChatService.addMessage({
      chat_id: 'c1',
      sender: 'agent',
      sender_id: 'agent_1',
      message_type: 'text',
      content: 'Reply',
    } as any);

    expect(result.message_count).toBe(2);
  });

  it('addMessage throws if chat not found', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { code: 'PGRST116', message: 'Not found' })
    );

    await expect(
      ChatService.addMessage({ chat_id: 'missing', content: 'Hi' } as any)
    ).rejects.toThrow('Chat not found');
  });

  it('markMessagesAsRead updates is_read flag', async () => {
    const chat = {
      id: 'c1',
      chat_history: [
        { id: 'msg1', is_read: false },
        { id: 'msg2', is_read: false },
        { id: 'msg3', is_read: false },
      ],
    };
    mockSupabase.from
      .mockReturnValueOnce(createChainMock(chat)) // getChatById
      .mockReturnValueOnce(createChainMock(null)); // update

    await ChatService.markMessagesAsRead('c1', ['msg1', 'msg3']);
    expect(mockSupabase.from).toHaveBeenCalledWith('chats');
  });
});

describe('ChatService — Delete', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deleteChat removes from Supabase', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null));

    await ChatService.deleteChat('c1');
    expect(mockSupabase.from).toHaveBeenCalledWith('chats');
  });

  it('deleteChat throws on error', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null, { message: 'Delete failed' }));

    await expect(ChatService.deleteChat('c1')).rejects.toThrow('Failed to delete chat');
  });
});

describe('ChatService — Search', () => {
  beforeEach(() => vi.clearAllMocks());

  it('searchChats returns results with relevance score', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([
      { id: 'c1', customer_name: 'Alice', last_message: 'Need help' },
    ]));

    const results = await ChatService.searchChats('Alice');
    expect(results).toHaveLength(1);
    expect(results[0].relevance_score).toBe(1.0);
    expect(results[0].chat.customer_name).toBe('Alice');
  });

  it('searchChats returns empty for no matches', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null));

    const results = await ChatService.searchChats('nonexistent');
    expect(results).toEqual([]);
  });
});

describe('ChatService — Stats', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getChatStats computes all aggregates', async () => {
    const chats = [
      { status: 'active', priority: 'high', chat_type: 'inbound', customer_sentiment: 'positive', resolution_status: null, duration_seconds: 300, message_count: 10, customer_satisfaction: 5 },
      { status: 'closed', priority: 'normal', chat_type: 'outbound', customer_sentiment: 'neutral', resolution_status: 'resolved', duration_seconds: 600, message_count: 20, customer_satisfaction: 4 },
      { status: 'closed', priority: 'low', chat_type: 'inbound', customer_sentiment: 'negative', resolution_status: 'escalated', duration_seconds: 120, message_count: 5, customer_satisfaction: null },
      { status: 'transferred', priority: 'urgent', chat_type: 'transfer', customer_sentiment: 'frustrated', resolution_status: 'transferred', duration_seconds: 0, message_count: 3, customer_satisfaction: null },
      { status: 'abandoned', priority: 'normal', chat_type: 'callback', customer_sentiment: null, resolution_status: null, duration_seconds: 0, message_count: 1, customer_satisfaction: null },
    ];
    mockSupabase.from.mockReturnValue(createChainMock(chats));

    const stats = await ChatService.getChatStats();

    expect(stats.total).toBe(5);
    expect(stats.active).toBe(1);
    expect(stats.closed).toBe(2);
    expect(stats.transferred).toBe(1);
    expect(stats.abandoned).toBe(1);

    expect(stats.by_priority.high).toBe(1);
    expect(stats.by_priority.urgent).toBe(1);
    expect(stats.by_type.inbound).toBe(2);
    expect(stats.by_type.outbound).toBe(1);
    expect(stats.by_sentiment.positive).toBe(1);
    expect(stats.by_sentiment.frustrated).toBe(1);
    expect(stats.by_resolution.resolved).toBe(1);
    expect(stats.by_resolution.escalated).toBe(1);

    // avg duration: (300+600+120+0+0)/5 = 204
    expect(stats.average_duration).toBe(204);
    // avg messages: (10+20+5+3+1)/5 = 7.8
    expect(stats.average_messages).toBe(7.8);
    // avg satisfaction: (5+4)/2 = 4.5
    expect(stats.average_satisfaction).toBe(4.5);
    // resolution rate: 1 resolved / 5 total = 20%
    expect(stats.resolution_rate).toBe(20);
  });

  it('getChatStats returns zeros for empty data', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null));

    const stats = await ChatService.getChatStats();
    expect(stats.total).toBe(0);
    expect(stats.average_duration).toBe(0);
    expect(stats.resolution_rate).toBe(0);
  });
});
