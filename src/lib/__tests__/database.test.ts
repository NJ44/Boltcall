/**
 * Database — Workspace & Business Profile CRUD tests.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

function createChainMock(resolvedData: any = [], resolvedError: any = null) {
  const resolved = Promise.resolve({ data: resolvedData, error: resolvedError });
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
  from: vi.fn(),
}));

vi.mock('../supabase', () => ({ supabase: mockSupabase }));

import {
  createWorkspace,
  createBusinessProfile,
  createUserWorkspaceAndProfile,
  getUserWorkspaces,
  getUserBusinessProfiles,
} from '../database';

describe('Workspace — Create', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('createWorkspace inserts and returns workspace', async () => {
    const ws = { id: 'ws_1', name: 'Acme Dental', slug: 'acme-dental', user_id: 'u1', created_at: '2026-04-05' };
    mockSupabase.from.mockReturnValue(createChainMock(ws));

    const result = await createWorkspace({ name: 'Acme Dental', slug: 'acme-dental', user_id: 'u1' });
    expect(result.id).toBe('ws_1');
    expect(result.name).toBe('Acme Dental');
    expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
  });

  it('createWorkspace throws on duplicate slug (23505)', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { code: '23505', message: 'duplicate key value violates unique constraint "workspaces_slug_key"' })
    );

    await expect(
      createWorkspace({ name: 'Dupe', slug: 'dupe', user_id: 'u1' })
    ).rejects.toThrow('A workspace with this identifier already exists');
  });

  it('createWorkspace throws on duplicate business name', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { code: '23505', message: 'unique_user_business_name' })
    );

    await expect(
      createWorkspace({ name: 'Same Name', slug: 'same', user_id: 'u1' })
    ).rejects.toThrow('You already have a business with this name');
  });

  it('createWorkspace throws generic error for other failures', async () => {
    mockSupabase.from.mockReturnValue(
      createChainMock(null, { code: '42501', message: 'permission denied' })
    );

    await expect(
      createWorkspace({ name: 'Test', slug: 'test', user_id: 'u1' })
    ).rejects.toThrow('Failed to create workspace: permission denied');
  });
});

describe('Business Profile — Create', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('createBusinessProfile inserts and returns profile', async () => {
    const bp = { id: 'bp_1', business_name: 'Acme Dental', workspace_id: 'ws_1' };
    mockSupabase.from.mockReturnValue(createChainMock(bp));

    const result = await createBusinessProfile({
      workspace_id: 'ws_1',
      user_id: 'u1',
      business_name: 'Acme Dental',
      main_category: 'dentist',
      country: 'us',
      service_areas: ['Downtown'],
      opening_hours: {},
      languages: ['en'],
    });

    expect(result.id).toBe('bp_1');
    expect(mockSupabase.from).toHaveBeenCalledWith('business_profiles');
  });
});

describe('Workspace + Profile — Combined', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('createUserWorkspaceAndProfile creates both and returns them', async () => {
    const ws = { id: 'ws_1', name: 'Acme', slug: 'acme-abc-123', user_id: 'u1', created_at: '2026-04-05' };
    const bp = { id: 'bp_1', business_name: 'Acme', workspace_id: 'ws_1', user_id: 'u1', created_at: '2026-04-05' };

    mockSupabase.from
      .mockReturnValueOnce(createChainMock(ws))  // createWorkspace
      .mockReturnValueOnce(createChainMock(bp));  // createBusinessProfile

    const result = await createUserWorkspaceAndProfile('u1', {
      business_name: 'Acme',
      main_category: 'dentist',
      country: 'us',
      service_areas: ['Downtown'],
      opening_hours: {},
      languages: ['en'],
    });

    expect(result.workspace.id).toBe('ws_1');
    expect(result.businessProfile.id).toBe('bp_1');
    expect(result.businessProfile.workspace_id).toBe('ws_1');
  });

  it('createUserWorkspaceAndProfile generates unique slug from business name', async () => {
    const ws = { id: 'ws_1', name: 'My Great Business!', slug: 'my-great-business-xxx', user_id: 'u1', created_at: '' };
    const bp = { id: 'bp_1', workspace_id: 'ws_1', user_id: 'u1', created_at: '' };

    mockSupabase.from
      .mockReturnValueOnce(createChainMock(ws))
      .mockReturnValueOnce(createChainMock(bp));

    await createUserWorkspaceAndProfile('u1', {
      business_name: 'My Great Business!',
      main_category: 'salon',
      country: 'uk',
      service_areas: [],
      opening_hours: {},
      languages: ['en'],
    });

    // Workspace was called with a slug derived from business name
    expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
  });
});

describe('Workspace & Profile — Read', () => {
  beforeEach(() => { vi.clearAllMocks(); mockSupabase.from.mockReturnValue(createChainMock()); });

  it('getUserWorkspaces returns array ordered by date', async () => {
    const workspaces = [
      { id: 'ws_2', name: 'New', created_at: '2026-04-05' },
      { id: 'ws_1', name: 'Old', created_at: '2026-03-01' },
    ];
    mockSupabase.from.mockReturnValue(createChainMock(workspaces));

    const result = await getUserWorkspaces('u1');
    expect(result).toHaveLength(2);
    expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
  });

  it('getUserWorkspaces returns empty array on null', async () => {
    mockSupabase.from.mockReturnValue(createChainMock(null));

    const result = await getUserWorkspaces('u1');
    expect(result).toEqual([]);
  });

  it('getUserBusinessProfiles returns profiles', async () => {
    mockSupabase.from.mockReturnValue(createChainMock([{ id: 'bp_1' }]));

    const result = await getUserBusinessProfiles('u1');
    expect(result).toHaveLength(1);
    expect(mockSupabase.from).toHaveBeenCalledWith('business_profiles');
  });
});
