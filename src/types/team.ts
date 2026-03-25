// ─── Team & RBAC Types ───────────────────────────────────────────────────

export type PredefinedRole = 'owner' | 'admin' | 'manager' | 'agent' | 'viewer';
export type MemberStatus = 'active' | 'invited' | 'pending' | 'suspended' | 'removed';

export interface TeamMember {
  id: string;
  workspace_id: string;
  user_id: string | null;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: PredefinedRole | string; // string for custom roles
  status: MemberStatus;
  invited_by: string;
  invited_at: string;
  accepted_at: string | null;
  last_active: string | null;
  suspended_at: string | null;
  suspended_reason: string | null;
}

// ─── Permission Groups ──────────────────────────────────────────────────

export type PermissionGroup =
  | 'communication'
  | 'leads'
  | 'analytics'
  | 'settings'
  | 'billing'
  | 'integrations'
  | 'agents'
  | 'knowledge_base';

export interface Permission {
  id: string;
  key: string;
  label: string;
  description: string;
  group: PermissionGroup;
}

export interface Role {
  id: string;
  workspace_id: string | null; // null = system role
  name: string;
  slug: PredefinedRole | string;
  description: string;
  is_system: boolean;
  color: string;
  icon: string; // lucide icon name
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

// ─── Activity Log ────────────────────────────────────────────────────────

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'config_change'
  | 'agent_created'
  | 'agent_modified'
  | 'agent_deleted'
  | 'number_purchased'
  | 'number_released'
  | 'integration_connected'
  | 'integration_disconnected'
  | 'member_invited'
  | 'member_removed'
  | 'member_suspended'
  | 'member_role_changed'
  | 'plan_changed'
  | 'api_key_created'
  | 'api_key_revoked'
  | 'knowledge_base_updated'
  | 'workspace_updated'
  | 'role_created'
  | 'role_modified'
  | 'role_deleted';

export interface ActivityLog {
  id: string;
  workspace_id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  action: ActivityAction;
  details: string;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface ActivityLogFilter {
  userId?: string;
  action?: ActivityAction;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// ─── API Keys ────────────────────────────────────────────────────────────

export type ApiKeyPermission = 'read' | 'write';
export type ApiKeyResource =
  | 'calls'
  | 'leads'
  | 'agents'
  | 'analytics'
  | 'contacts'
  | 'knowledge_base'
  | 'integrations';

export type ApiKeyStatus = 'active' | 'revoked' | 'expired';

export interface ApiKeyResourcePermission {
  resource: ApiKeyResource;
  permission: ApiKeyPermission;
}

export interface ApiKey {
  id: string;
  workspace_id: string;
  name: string;
  key_prefix: string; // first 8 chars for display
  key_hash: string;
  permissions: ApiKeyResourcePermission[];
  status: ApiKeyStatus;
  expires_at: string | null;
  last_used_at: string | null;
  created_by: string;
  created_at: string;
  revoked_at: string | null;
  usage_24h: number;
  usage_7d: number;
  usage_30d: number;
  rate_limit: number; // requests per minute
}

// ─── Workspace Settings ──────────────────────────────────────────────────

export interface WorkspaceSettings {
  id: string;
  name: string;
  logo_url: string | null;
  default_timezone: string;
  default_language: string;
  data_retention_days: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// ─── Default Permissions Matrix ──────────────────────────────────────────

export const PERMISSION_GROUPS: Record<PermissionGroup, string> = {
  communication: 'Communication',
  leads: 'Leads',
  analytics: 'Analytics',
  settings: 'Settings',
  billing: 'Billing',
  integrations: 'Integrations',
  agents: 'Agents',
  knowledge_base: 'Knowledge Base',
};

export const ALL_PERMISSIONS: Permission[] = [
  // Communication
  { id: 'comm_view_calls', key: 'communication.view_calls', label: 'View calls', description: 'View call history and transcripts', group: 'communication' },
  { id: 'comm_make_calls', key: 'communication.make_calls', label: 'Make calls', description: 'Initiate outbound calls', group: 'communication' },
  { id: 'comm_view_chats', key: 'communication.view_chats', label: 'View chats', description: 'View chat conversations', group: 'communication' },
  { id: 'comm_send_sms', key: 'communication.send_sms', label: 'Send SMS', description: 'Send SMS messages', group: 'communication' },
  // Leads
  { id: 'leads_view', key: 'leads.view', label: 'View leads', description: 'View lead list and details', group: 'leads' },
  { id: 'leads_manage', key: 'leads.manage', label: 'Manage leads', description: 'Create, edit, and delete leads', group: 'leads' },
  { id: 'leads_export', key: 'leads.export', label: 'Export leads', description: 'Export lead data to CSV', group: 'leads' },
  // Analytics
  { id: 'analytics_view', key: 'analytics.view', label: 'View analytics', description: 'View dashboards and reports', group: 'analytics' },
  { id: 'analytics_export', key: 'analytics.export', label: 'Export reports', description: 'Export analytics data', group: 'analytics' },
  // Settings
  { id: 'settings_general', key: 'settings.general', label: 'General settings', description: 'Manage workspace settings', group: 'settings' },
  { id: 'settings_members', key: 'settings.members', label: 'Manage members', description: 'Invite, remove, and change member roles', group: 'settings' },
  { id: 'settings_roles', key: 'settings.roles', label: 'Manage roles', description: 'Create and modify roles and permissions', group: 'settings' },
  { id: 'settings_api_keys', key: 'settings.api_keys', label: 'Manage API keys', description: 'Create and revoke API keys', group: 'settings' },
  // Billing
  { id: 'billing_view', key: 'billing.view', label: 'View billing', description: 'View subscription and invoices', group: 'billing' },
  { id: 'billing_manage', key: 'billing.manage', label: 'Manage billing', description: 'Change plans and payment methods', group: 'billing' },
  // Integrations
  { id: 'integrations_view', key: 'integrations.view', label: 'View integrations', description: 'View connected integrations', group: 'integrations' },
  { id: 'integrations_manage', key: 'integrations.manage', label: 'Manage integrations', description: 'Connect and disconnect integrations', group: 'integrations' },
  // Agents
  { id: 'agents_view', key: 'agents.view', label: 'View agents', description: 'View AI agent configurations', group: 'agents' },
  { id: 'agents_manage', key: 'agents.manage', label: 'Manage agents', description: 'Create, modify, and delete AI agents', group: 'agents' },
  { id: 'agents_test', key: 'agents.test', label: 'Test agents', description: 'Run test calls with agents', group: 'agents' },
  // Knowledge Base
  { id: 'kb_view', key: 'knowledge_base.view', label: 'View knowledge base', description: 'View knowledge base content', group: 'knowledge_base' },
  { id: 'kb_manage', key: 'knowledge_base.manage', label: 'Manage knowledge base', description: 'Add, edit, and delete KB entries', group: 'knowledge_base' },
];

// Default permission assignments for predefined roles
export const DEFAULT_ROLE_PERMISSIONS: Record<PredefinedRole, string[]> = {
  owner: ALL_PERMISSIONS.map((p) => p.id), // all permissions
  admin: ALL_PERMISSIONS.filter((p) => !p.key.startsWith('billing.manage')).map((p) => p.id),
  manager: ALL_PERMISSIONS.filter((p) =>
    ['agents', 'leads', 'analytics', 'communication', 'knowledge_base', 'integrations'].some((g) => p.group === g) ||
    p.key === 'billing.view'
  ).map((p) => p.id),
  agent: ALL_PERMISSIONS.filter((p) =>
    ['communication'].some((g) => p.group === g) ||
    ['leads.view', 'agents.view', 'knowledge_base.view'].includes(p.key)
  ).map((p) => p.id),
  viewer: ALL_PERMISSIONS.filter((p) => p.key.endsWith('.view')).map((p) => p.id),
};

export const PREDEFINED_ROLES: Omit<Role, 'id' | 'workspace_id' | 'created_at'>[] = [
  { name: 'Owner', slug: 'owner', description: 'Full access, billing, can delete workspace', is_system: true, color: 'yellow', icon: 'Crown' },
  { name: 'Admin', slug: 'admin', description: 'All features except billing and workspace deletion', is_system: true, color: 'purple', icon: 'Shield' },
  { name: 'Manager', slug: 'manager', description: 'Manage agents, view analytics, manage leads', is_system: true, color: 'blue', icon: 'Briefcase' },
  { name: 'Agent', slug: 'agent', description: 'View assigned calls/chats only', is_system: true, color: 'green', icon: 'Headphones' },
  { name: 'Viewer', slug: 'viewer', description: 'Read-only access to analytics and reports', is_system: true, color: 'gray', icon: 'Eye' },
];

export const ROLE_COLOR_MAP: Record<string, string> = {
  yellow: 'text-yellow-600 bg-yellow-100',
  purple: 'text-purple-600 bg-purple-100',
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  gray: 'text-gray-600 bg-gray-100',
  red: 'text-red-600 bg-red-100',
  pink: 'text-pink-600 bg-pink-100',
  indigo: 'text-indigo-600 bg-indigo-100',
  teal: 'text-teal-600 bg-teal-100',
  orange: 'text-orange-600 bg-orange-100',
};

export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  login: 'Logged in',
  logout: 'Logged out',
  config_change: 'Changed configuration',
  agent_created: 'Created agent',
  agent_modified: 'Modified agent',
  agent_deleted: 'Deleted agent',
  number_purchased: 'Purchased phone number',
  number_released: 'Released phone number',
  integration_connected: 'Connected integration',
  integration_disconnected: 'Disconnected integration',
  member_invited: 'Invited member',
  member_removed: 'Removed member',
  member_suspended: 'Suspended member',
  member_role_changed: 'Changed member role',
  plan_changed: 'Changed plan',
  api_key_created: 'Created API key',
  api_key_revoked: 'Revoked API key',
  knowledge_base_updated: 'Updated knowledge base',
  workspace_updated: 'Updated workspace',
  role_created: 'Created role',
  role_modified: 'Modified role',
  role_deleted: 'Deleted role',
};

export const ACTIVITY_ACTION_COLORS: Record<ActivityAction, string> = {
  login: 'text-green-600 bg-green-50',
  logout: 'text-gray-600 bg-gray-50',
  config_change: 'text-blue-600 bg-blue-50',
  agent_created: 'text-emerald-600 bg-emerald-50',
  agent_modified: 'text-blue-600 bg-blue-50',
  agent_deleted: 'text-red-600 bg-red-50',
  number_purchased: 'text-purple-600 bg-purple-50',
  number_released: 'text-orange-600 bg-orange-50',
  integration_connected: 'text-teal-600 bg-teal-50',
  integration_disconnected: 'text-orange-600 bg-orange-50',
  member_invited: 'text-blue-600 bg-blue-50',
  member_removed: 'text-red-600 bg-red-50',
  member_suspended: 'text-yellow-600 bg-yellow-50',
  member_role_changed: 'text-purple-600 bg-purple-50',
  plan_changed: 'text-indigo-600 bg-indigo-50',
  api_key_created: 'text-cyan-600 bg-cyan-50',
  api_key_revoked: 'text-red-600 bg-red-50',
  knowledge_base_updated: 'text-blue-600 bg-blue-50',
  workspace_updated: 'text-blue-600 bg-blue-50',
  role_created: 'text-emerald-600 bg-emerald-50',
  role_modified: 'text-blue-600 bg-blue-50',
  role_deleted: 'text-red-600 bg-red-50',
};
