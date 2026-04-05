/**
 * Email Service — feature tests for accounts, threads, drafts, AI generation, stats.
 */
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

function okJson(body: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
}
function failJson(status: number, body: Record<string, unknown>) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve(body) });
}

import {
  getEmailAccounts,
  disconnectEmailAccount,
  updateEmailSettings,
  startGmailAuth,
  startOutlookAuth,
  getEmailThreads,
  getThreadDetail,
  markThread,
  getPendingDrafts,
  approveDraft,
  rejectDraft,
  editAndSend,
  generateDraft,
  getEmailStats,
} from '../emailService';

// ─── Account Management ─────────────────────────────────────────────────────

describe('Email — Accounts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getEmailAccounts returns account list', async () => {
    mockFetch.mockReturnValue(okJson({
      accounts: [
        { id: 'acc_1', provider: 'gmail', email_address: 'test@gmail.com', is_active: true },
      ],
    }));

    const accounts = await getEmailAccounts('user_1');
    expect(accounts).toHaveLength(1);
    expect(accounts[0].provider).toBe('gmail');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('list_accounts');
    expect(body.userId).toBe('user_1');
  });

  it('disconnectEmailAccount calls disconnect action', async () => {
    mockFetch.mockReturnValue(okJson({ success: true }));

    await disconnectEmailAccount('user_1', 'acc_1');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('disconnect');
    expect(body.accountId).toBe('acc_1');
  });

  it('updateEmailSettings sends partial settings', async () => {
    mockFetch.mockReturnValue(okJson({
      settings: { auto_send: true, response_tone: 'friendly', excluded_senders: [], daily_cap: 50 },
    }));

    const settings = await updateEmailSettings('user_1', 'acc_1', { auto_send: true });
    expect(settings.auto_send).toBe(true);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('update_settings');
    expect(body.settings.auto_send).toBe(true);
  });
});

// ─── OAuth Flows ────────────────────────────────────────────────────────────

describe('Email — OAuth', () => {
  beforeEach(() => vi.clearAllMocks());

  const originalLocation = window.location;
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' },
    });
  });
  afterAll(() => {
    Object.defineProperty(window, 'location', { writable: true, value: originalLocation });
  });

  it('startGmailAuth redirects to OAuth URL', async () => {
    mockFetch.mockReturnValue(okJson({ url: 'https://accounts.google.com/oauth?state=abc' }));

    await startGmailAuth('user_1');
    expect(window.location.href).toBe('https://accounts.google.com/oauth?state=abc');
  });

  it('startGmailAuth throws if no URL returned', async () => {
    mockFetch.mockReturnValue(okJson({}));
    await expect(startGmailAuth('user_1')).rejects.toThrow('Failed to get Gmail auth URL');
  });

  it('startOutlookAuth redirects to OAuth URL', async () => {
    mockFetch.mockReturnValue(okJson({ url: 'https://login.microsoftonline.com/oauth?state=xyz' }));

    await startOutlookAuth('user_1');
    expect(window.location.href).toBe('https://login.microsoftonline.com/oauth?state=xyz');
  });
});

// ─── Threads ────────────────────────────────────────────────────────────────

describe('Email — Threads', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getEmailThreads returns paginated threads', async () => {
    mockFetch.mockReturnValue(okJson({
      threads: [{ id: 't1', subject: 'Hello', status: 'open' }],
      total: 1,
      page: 1,
      totalPages: 1,
    }));

    const result = await getEmailThreads('user_1', { status: 'open', page: 1 });
    expect(result.threads).toHaveLength(1);
    expect(result.totalPages).toBe(1);
  });

  it('getThreadDetail returns thread with messages', async () => {
    mockFetch.mockReturnValue(okJson({
      thread: { id: 't1', subject: 'Hello' },
      messages: [
        { id: 'm1', direction: 'inbound', body_text: 'Hi there' },
        { id: 'm2', direction: 'outbound', body_text: 'Hello!' },
      ],
    }));

    const result = await getThreadDetail('user_1', 't1');
    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].direction).toBe('inbound');
  });

  it('markThread updates thread status', async () => {
    mockFetch.mockReturnValue(okJson({ success: true }));

    await markThread('user_1', 't1', 'closed');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('mark_thread');
    expect(body.status).toBe('closed');
  });
});

// ─── Drafts ─────────────────────────────────────────────────────────────────

describe('Email — Drafts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getPendingDrafts returns draft list', async () => {
    mockFetch.mockReturnValue(okJson({
      drafts: [
        { id: 'm1', ai_draft_text: 'Thanks for your email!', ai_draft_status: 'pending' },
      ],
    }));

    const drafts = await getPendingDrafts('user_1');
    expect(drafts).toHaveLength(1);
    expect(drafts[0].ai_draft_status).toBe('pending');
  });

  it('approveDraft sends approve action', async () => {
    mockFetch.mockReturnValue(okJson({ success: true }));

    await approveDraft('user_1', 'm1', 't1');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('approve_draft');
    expect(body.messageId).toBe('m1');
    expect(body.threadId).toBe('t1');
  });

  it('rejectDraft sends reject action', async () => {
    mockFetch.mockReturnValue(okJson({ success: true }));

    await rejectDraft('user_1', 'm1');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('reject_draft');
  });

  it('editAndSend sends edited text', async () => {
    mockFetch.mockReturnValue(okJson({ success: true }));

    await editAndSend('user_1', 'm1', 't1', 'Edited reply text');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('edit_send');
    expect(body.editedText).toBe('Edited reply text');
  });
});

// ─── AI Generation ──────────────────────────────────────────────────────────

describe('Email — AI Draft Generation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('generateDraft calls email-ai-responder', async () => {
    mockFetch.mockReturnValue(okJson({
      success: true,
      draftStatus: 'pending',
      messageId: 'm_new',
    }));

    const result = await generateDraft('user_1', 't1', 'acc_1');
    expect(result.success).toBe(true);
    expect(result.messageId).toBe('m_new');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('generate');
    expect(body.threadId).toBe('t1');
  });

  it('generateDraft supports regenerate action', async () => {
    mockFetch.mockReturnValue(okJson({ success: true, draftStatus: 'pending', messageId: 'm2' }));

    await generateDraft('user_1', 't1', 'acc_1', 'regenerate');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('regenerate');
  });

  it('generateDraft throws on AI failure', async () => {
    mockFetch.mockReturnValue(failJson(500, { error: 'Model unavailable' }));
    await expect(generateDraft('user_1', 't1', 'acc_1')).rejects.toThrow('Model unavailable');
  });
});

// ─── Stats ──────────────────────────────────────────────────────────────────

describe('Email — Stats', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getEmailStats returns aggregate stats', async () => {
    mockFetch.mockReturnValue(okJson({
      stats: {
        totalThreads: 50,
        openThreads: 12,
        pendingDrafts: 3,
        sentToday: 8,
        connectedAccounts: 2,
      },
    }));

    const stats = await getEmailStats('user_1');
    expect(stats.totalThreads).toBe(50);
    expect(stats.openThreads).toBe(12);
    expect(stats.pendingDrafts).toBe(3);
    expect(stats.connectedAccounts).toBe(2);
  });
});

// ─── Error handling ─────────────────────────────────────────────────────────

describe('Email — Error Handling', () => {
  beforeEach(() => vi.clearAllMocks());

  it('throws on non-ok response with error field', async () => {
    mockFetch.mockReturnValue(failJson(403, { error: 'Forbidden' }));
    await expect(getEmailAccounts('user_1')).rejects.toThrow('Forbidden');
  });

  it('throws generic message when no error field', async () => {
    mockFetch.mockReturnValue(failJson(500, {}));
    await expect(getEmailAccounts('user_1')).rejects.toThrow('Request failed: 500');
  });
});
