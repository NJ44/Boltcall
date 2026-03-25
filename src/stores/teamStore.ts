import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type {
  TeamMember,
  Role,
  ActivityLog,
  ActivityLogFilter,
  ApiKey,
  WorkspaceSettings,
  MemberStatus,
  ApiKeyResourcePermission,
} from '../types/team';

interface TeamState {
  // ─── Members ───
  members: TeamMember[];
  membersLoading: boolean;
  fetchMembers: (userId: string) => Promise<void>;
  inviteMember: (email: string, role: string, name?: string, message?: string) => Promise<void>;
  inviteBulk: (emails: string[], role: string) => Promise<{ success: string[]; failed: string[] }>;
  updateMemberRole: (memberId: string, role: string) => Promise<void>;
  updateMemberStatus: (memberId: string, status: MemberStatus, reason?: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  resendInvite: (memberId: string) => Promise<void>;

  // ─── Roles ───
  roles: Role[];
  rolesLoading: boolean;
  fetchRoles: (userId: string) => Promise<void>;
  createRole: (name: string, slug: string, description: string, color: string, permissionIds: string[]) => Promise<void>;
  updateRole: (roleId: string, updates: Partial<Role>, permissionIds?: string[]) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  rolePermissions: Record<string, string[]>; // roleId -> permissionId[]
  fetchRolePermissions: (userId: string) => Promise<void>;

  // ─── Activity Log ───
  activityLogs: ActivityLog[];
  activityLogsLoading: boolean;
  activityLogsTotalCount: number;
  fetchActivityLogs: (userId: string, filter?: ActivityLogFilter, page?: number, limit?: number) => Promise<void>;
  logActivity: (action: string, details: string, metadata?: Record<string, unknown>) => Promise<void>;

  // ─── API Keys ───
  apiKeys: ApiKey[];
  apiKeysLoading: boolean;
  fetchApiKeys: (userId: string) => Promise<void>;
  createApiKey: (name: string, permissions: ApiKeyResourcePermission[], expiresAt?: string) => Promise<string | null>;
  revokeApiKey: (keyId: string) => Promise<void>;

  // ─── Workspace Settings ───
  workspace: WorkspaceSettings | null;
  workspaceLoading: boolean;
  fetchWorkspace: (userId: string) => Promise<void>;
  updateWorkspace: (updates: Partial<WorkspaceSettings>) => Promise<void>;
  transferOwnership: (newOwnerId: string) => Promise<void>;
  deleteWorkspace: () => Promise<void>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  // ─── Members State ─────────────────────────────────────────────────────
  members: [],
  membersLoading: true,

  fetchMembers: async (userId: string) => {
    set({ membersLoading: true });
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('invited_by', userId)
        .neq('status', 'removed')
        .order('invited_at', { ascending: true });

      if (error) throw error;
      set({ members: (data || []) as TeamMember[] });
    } catch (err) {
      console.error('[teamStore] fetchMembers failed:', err);
    } finally {
      set({ membersLoading: false });
    }
  },

  inviteMember: async (email: string, role: string, name?: string, _message?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { error } = await supabase.from('workspace_members').insert({
      invited_by: session.user.id,
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      role,
      status: 'invited' as MemberStatus,
      invited_at: new Date().toISOString(),
    });

    if (error) throw error;
    await get().fetchMembers(session.user.id);
  },

  inviteBulk: async (emails: string[], role: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const existingEmails = get().members.map((m) => m.email.toLowerCase());
    const success: string[] = [];
    const failed: string[] = [];

    for (const rawEmail of emails) {
      const email = rawEmail.toLowerCase().trim();
      if (!email || !email.includes('@')) { failed.push(rawEmail); continue; }
      if (existingEmails.includes(email)) { failed.push(email); continue; }

      try {
        const { error } = await supabase.from('workspace_members').insert({
          invited_by: session.user.id,
          email,
          role,
          status: 'invited' as MemberStatus,
          invited_at: new Date().toISOString(),
        });
        if (error) { failed.push(email); } else { success.push(email); }
      } catch {
        failed.push(email);
      }
    }

    await get().fetchMembers(session.user.id);
    return { success, failed };
  },

  updateMemberRole: async (memberId: string, role: string) => {
    const { error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('id', memberId);
    if (error) throw error;

    set((s) => ({
      members: s.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
    }));
  },

  updateMemberStatus: async (memberId: string, status: MemberStatus, reason?: string) => {
    const updates: Record<string, unknown> = { status };
    if (status === 'suspended') {
      updates.suspended_at = new Date().toISOString();
      updates.suspended_reason = reason || null;
    }

    const { error } = await supabase
      .from('workspace_members')
      .update(updates)
      .eq('id', memberId);
    if (error) throw error;

    set((s) => ({
      members: s.members.map((m) => (m.id === memberId ? { ...m, ...updates } as TeamMember : m)),
    }));
  },

  removeMember: async (memberId: string) => {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('id', memberId);
    if (error) throw error;

    set((s) => ({
      members: s.members.filter((m) => m.id !== memberId),
    }));
  },

  resendInvite: async (memberId: string) => {
    const { error } = await supabase
      .from('workspace_members')
      .update({ invited_at: new Date().toISOString() })
      .eq('id', memberId);
    if (error) throw error;
  },

  // ─── Roles State ───────────────────────────────────────────────────────
  roles: [],
  rolesLoading: true,
  rolePermissions: {},

  fetchRoles: async (userId: string) => {
    set({ rolesLoading: true });
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .or(`is_system.eq.true,workspace_id.eq.${userId}`)
        .order('is_system', { ascending: false });

      if (error) throw error;
      set({ roles: (data || []) as Role[] });
    } catch (err) {
      console.error('[teamStore] fetchRoles failed:', err);
    } finally {
      set({ rolesLoading: false });
    }
  },

  fetchRolePermissions: async (_userId: string) => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('role_id, permission_id');

      if (error) throw error;

      const map: Record<string, string[]> = {};
      (data || []).forEach((rp: { role_id: string; permission_id: string }) => {
        if (!map[rp.role_id]) map[rp.role_id] = [];
        map[rp.role_id].push(rp.permission_id);
      });
      set({ rolePermissions: map });
    } catch (err) {
      console.error('[teamStore] fetchRolePermissions failed:', err);
    }
  },

  createRole: async (name: string, slug: string, description: string, color: string, permissionIds: string[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data: role, error } = await supabase
      .from('roles')
      .insert({
        workspace_id: session.user.id,
        name,
        slug,
        description,
        color,
        icon: 'Shield',
        is_system: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Insert permission associations
    if (role && permissionIds.length > 0) {
      const rows = permissionIds.map((pid) => ({ role_id: role.id, permission_id: pid }));
      await supabase.from('role_permissions').insert(rows);
    }

    await get().fetchRoles(session.user.id);
    await get().fetchRolePermissions(session.user.id);
  },

  updateRole: async (roleId: string, updates: Partial<Role>, permissionIds?: string[]) => {
    const { error } = await supabase
      .from('roles')
      .update(updates)
      .eq('id', roleId);
    if (error) throw error;

    if (permissionIds !== undefined) {
      await supabase.from('role_permissions').delete().eq('role_id', roleId);
      if (permissionIds.length > 0) {
        const rows = permissionIds.map((pid) => ({ role_id: roleId, permission_id: pid }));
        await supabase.from('role_permissions').insert(rows);
      }
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await get().fetchRoles(session.user.id);
      await get().fetchRolePermissions(session.user.id);
    }
  },

  deleteRole: async (roleId: string) => {
    await supabase.from('role_permissions').delete().eq('role_id', roleId);
    const { error } = await supabase.from('roles').delete().eq('id', roleId);
    if (error) throw error;

    set((s) => ({ roles: s.roles.filter((r) => r.id !== roleId) }));
  },

  // ─── Activity Log State ────────────────────────────────────────────────
  activityLogs: [],
  activityLogsLoading: true,
  activityLogsTotalCount: 0,

  fetchActivityLogs: async (userId: string, filter?: ActivityLogFilter, page = 0, limit = 50) => {
    set({ activityLogsLoading: true });
    try {
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .eq('workspace_id', userId)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (filter?.userId) query = query.eq('user_id', filter.userId);
      if (filter?.action) query = query.eq('action', filter.action);
      if (filter?.dateFrom) query = query.gte('created_at', filter.dateFrom);
      if (filter?.dateTo) query = query.lte('created_at', filter.dateTo);
      if (filter?.search) query = query.ilike('details', `%${filter.search}%`);

      const { data, error, count } = await query;
      if (error) throw error;

      set({
        activityLogs: (data || []) as ActivityLog[],
        activityLogsTotalCount: count || 0,
      });
    } catch (err) {
      console.error('[teamStore] fetchActivityLogs failed:', err);
    } finally {
      set({ activityLogsLoading: false });
    }
  },

  logActivity: async (action: string, details: string, metadata?: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from('activity_logs').insert({
      workspace_id: session.user.id,
      user_id: session.user.id,
      user_email: session.user.email,
      user_name: session.user.user_metadata?.name || null,
      action,
      details,
      metadata: metadata || null,
    });
  },

  // ─── API Keys State ────────────────────────────────────────────────────
  apiKeys: [],
  apiKeysLoading: true,

  fetchApiKeys: async (userId: string) => {
    set({ apiKeysLoading: true });
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('workspace_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ apiKeys: (data || []) as ApiKey[] });
    } catch (err) {
      console.error('[teamStore] fetchApiKeys failed:', err);
    } finally {
      set({ apiKeysLoading: false });
    }
  },

  createApiKey: async (name: string, permissions: ApiKeyResourcePermission[], expiresAt?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    // Generate a random API key
    const rawKey = `bc_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyPrefix = rawKey.substring(0, 11); // "bc_" + 8 chars

    const { error } = await supabase.from('api_keys').insert({
      workspace_id: session.user.id,
      name,
      key_prefix: keyPrefix,
      key_hash: rawKey, // In production, hash this server-side
      permissions,
      status: 'active',
      expires_at: expiresAt || null,
      created_by: session.user.id,
      rate_limit: 60,
    });

    if (error) throw error;
    await get().fetchApiKeys(session.user.id);
    return rawKey; // Return full key only on creation
  },

  revokeApiKey: async (keyId: string) => {
    const { error } = await supabase
      .from('api_keys')
      .update({ status: 'revoked', revoked_at: new Date().toISOString() })
      .eq('id', keyId);
    if (error) throw error;

    set((s) => ({
      apiKeys: s.apiKeys.map((k) =>
        k.id === keyId ? { ...k, status: 'revoked' as const, revoked_at: new Date().toISOString() } : k
      ),
    }));
  },

  // ─── Workspace State ──────────────────────────────────────────────────
  workspace: null,
  workspaceLoading: true,

  fetchWorkspace: async (userId: string) => {
    set({ workspaceLoading: true });
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId)
        .maybeSingle();

      if (error) throw error;
      set({ workspace: data as WorkspaceSettings | null });
    } catch (err) {
      console.error('[teamStore] fetchWorkspace failed:', err);
    } finally {
      set({ workspaceLoading: false });
    }
  },

  updateWorkspace: async (updates: Partial<WorkspaceSettings>) => {
    const ws = get().workspace;
    if (!ws) return;

    const { error } = await supabase
      .from('workspaces')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', ws.id);
    if (error) throw error;

    set({ workspace: { ...ws, ...updates, updated_at: new Date().toISOString() } as WorkspaceSettings });
  },

  transferOwnership: async (newOwnerId: string) => {
    const ws = get().workspace;
    if (!ws) return;

    const { error } = await supabase
      .from('workspaces')
      .update({ owner_id: newOwnerId })
      .eq('id', ws.id);
    if (error) throw error;
  },

  deleteWorkspace: async () => {
    const ws = get().workspace;
    if (!ws) return;

    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', ws.id);
    if (error) throw error;

    set({ workspace: null });
  },
}));
