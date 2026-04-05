/**
 * AI Receptionist (Retell) — CRUD tests for agents and knowledge bases.
 * Tests: create KB, create agent, create full (KB+agent), list, get, update, delete, call history.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the api module so FUNCTIONS_BASE is defined
vi.mock('../api', () => ({ FUNCTIONS_BASE: 'http://localhost:8888/.netlify/functions' }));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import {
  createRetellKnowledgeBase,
  createRetellAgent,
  createRetellAgentAndKnowledgeBase,
  generateAgentPrompt,
  listRetellAgents,
  getRetellAgentDetails,
  updateRetellAgent,
  deleteRetellAgent,
  getRetellCallHistory,
  getRetellCallDetails,
} from '../retell';

function okJson(body: Record<string, unknown>) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
}

function failJson(status: number, body: Record<string, unknown>) {
  return Promise.resolve({ ok: false, status, json: () => Promise.resolve(body) });
}

const baseKbData = {
  businessName: 'Acme Dental',
  mainCategory: 'dentist',
  country: 'us',
  serviceAreas: ['Downtown'],
  openingHours: { monday: { open: '09:00', close: '17:00', closed: false } },
  languages: ['en'],
  websiteUrl: 'https://acmedental.com',
};

describe('Retell — Knowledge Base', () => {
  beforeEach(() => vi.clearAllMocks());

  it('createRetellKnowledgeBase sends correct payload and returns KB id', async () => {
    mockFetch.mockReturnValue(okJson({ knowledge_base_id: 'kb_123' }));

    const result = await createRetellKnowledgeBase(baseKbData);

    expect(result.success).toBe(true);
    expect(result.knowledge_base_id).toBe('kb_123');

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('/retell-agents');
    const body = JSON.parse(opts.body);
    expect(body.action).toBe('create_kb');
    expect(body.knowledge_base_name).toContain('Acme Dental');
    expect(body.knowledge_base_texts.length).toBeGreaterThan(0);
    expect(body.knowledge_base_urls).toContain('https://acmedental.com');
  });

  it('createRetellKnowledgeBase builds texts for services, FAQs, and policies', async () => {
    mockFetch.mockReturnValue(okJson({ knowledge_base_id: 'kb_456' }));

    await createRetellKnowledgeBase({
      ...baseKbData,
      services: [{ name: 'Cleaning', duration: 60, price: 200 }],
      faqs: [{ question: 'Insurance?', answer: 'Yes' }],
      policies: { cancellation: '24h notice', reschedule: 'Free', deposit: '$50' },
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const titles = body.knowledge_base_texts.map((t: any) => t.title);
    expect(titles).toContain('Business Information');
    expect(titles).toContain('Opening Hours');
    expect(titles).toContain('Service: Cleaning');
    expect(titles).toContain('FAQ: Insurance?');
    expect(titles).toContain('Business Policies');
  });

  it('createRetellKnowledgeBase throws on API error', async () => {
    mockFetch.mockReturnValue(failJson(500, { error: 'Server error' }));
    await expect(createRetellKnowledgeBase(baseKbData)).rejects.toThrow('Server error');
  });
});

describe('Retell — Agent CRUD', () => {
  beforeEach(() => vi.clearAllMocks());

  it('createRetellAgent sends correct payload', async () => {
    mockFetch.mockReturnValue(okJson({ agent_id: 'agent_abc' }));

    const result = await createRetellAgent({
      businessName: 'Acme Dental',
      knowledgeBaseId: 'kb_123',
      mainCategory: 'dentist',
      languages: ['en'],
    });

    expect(result.success).toBe(true);
    expect(result.agent_id).toBe('agent_abc');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('create_agent');
    expect(body.knowledge_base_ids).toEqual(['kb_123']);
    expect(body.language).toBe('en-US');
  });

  it('createRetellAgent uses provided voiceId', async () => {
    mockFetch.mockReturnValue(okJson({ agent_id: 'agent_xyz' }));

    await createRetellAgent({
      businessName: 'Test',
      knowledgeBaseId: 'kb_1',
      mainCategory: 'salon',
      languages: ['es'],
      voiceId: 'custom-voice',
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.voice_id).toBe('custom-voice');
    expect(body.language).toBe('es');
  });

  it('createRetellAgentAndKnowledgeBase returns both IDs', async () => {
    mockFetch.mockReturnValue(okJson({
      knowledge_base_id: 'kb_full',
      agent_id: 'agent_full',
      prompt_used: 'professional',
    }));

    const result = await createRetellAgentAndKnowledgeBase(baseKbData);

    expect(result.success).toBe(true);
    expect(result.knowledge_base_id).toBe('kb_full');
    expect(result.agent_id).toBe('agent_full');
    expect(result.prompt_used).toBe('professional');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.action).toBe('create_full');
    expect(body.prompt_config).toBeDefined();
    expect(body.prompt_config.businessProfile.businessName).toBe('Acme Dental');
  });

  it('listRetellAgents returns array', async () => {
    mockFetch.mockReturnValue(okJson([{ agent_id: 'a1' }, { agent_id: 'a2' }]));

    const agents = await listRetellAgents();
    expect(agents).toHaveLength(2);
    expect(mockFetch.mock.calls[0][0]).toContain('/retell-agents');
  });

  it('getRetellAgentDetails fetches by agent_id', async () => {
    mockFetch.mockReturnValue(okJson({ agent_id: 'a1', agent_name: 'Test Agent' }));

    const agent = await getRetellAgentDetails('a1');
    expect(agent.agent_name).toBe('Test Agent');
    expect(mockFetch.mock.calls[0][0]).toContain('agent_id=a1');
  });

  it('updateRetellAgent sends PUT with updates', async () => {
    mockFetch.mockReturnValue(okJson({ agent_id: 'a1', agent_name: 'Updated' }));

    const result = await updateRetellAgent('a1', { agent_name: 'Updated' });
    expect(result.agent_name).toBe('Updated');

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.method).toBe('PUT');
    const body = JSON.parse(opts.body);
    expect(body.agent_id).toBe('a1');
    expect(body.agent_name).toBe('Updated');
  });

  it('deleteRetellAgent sends DELETE', async () => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: true }));

    await deleteRetellAgent('a1');

    const [url, opts] = mockFetch.mock.calls[0];
    expect(opts.method).toBe('DELETE');
    expect(url).toContain('agent_id=a1');
  });

  it('deleteRetellAgent throws on failure', async () => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: false, status: 404 }));
    await expect(deleteRetellAgent('missing')).rejects.toThrow('Failed to delete agent');
  });
});

describe('Retell — Agent Prompt Generation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('generateAgentPrompt returns prompt, beginMessage, industry', async () => {
    mockFetch.mockReturnValue(okJson({
      prompt: 'You are a dental receptionist...',
      beginMessage: 'Hello! Thanks for calling.',
      industry: 'healthcare',
    }));

    const result = await generateAgentPrompt({
      businessProfile: {
        businessName: 'Acme Dental',
        mainCategory: 'dentist',
        country: 'us',
      },
    });

    expect(result.prompt).toContain('dental receptionist');
    expect(result.beginMessage).toBeTruthy();
    expect(result.industry).toBe('healthcare');
  });
});

describe('Retell — Call History', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getRetellCallHistory returns calls array', async () => {
    mockFetch.mockReturnValue(okJson({
      calls: [{ call_id: 'c1', agent_id: 'a1', call_status: 'ended' }],
      pagination_key: 'next_page',
    }));

    const result = await getRetellCallHistory({ limit: 10 });
    expect(result.calls).toHaveLength(1);
    expect(result.calls[0].call_id).toBe('c1');
    expect(result.pagination_key).toBe('next_page');
  });

  it('getRetellCallHistory handles flat array response', async () => {
    mockFetch.mockReturnValue(okJson([
      { call_id: 'c1' },
      { call_id: 'c2' },
    ]));

    const result = await getRetellCallHistory({});
    expect(result.calls).toHaveLength(2);
    expect(result.total_count).toBe(2);
  });

  it('getRetellCallDetails fetches single call', async () => {
    mockFetch.mockReturnValue(okJson({
      call_id: 'c1',
      transcript: 'Hello...',
      call_analysis: { call_summary: 'Patient called to book cleaning' },
    }));

    const call = await getRetellCallDetails('c1');
    expect(call.call_id).toBe('c1');
    expect(call.transcript).toBe('Hello...');
  });
});
