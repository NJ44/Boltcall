-- ═══════════════════════════════════════════════════════════════════════════
-- Team Features Migration: RBAC, Activity Logs, API Keys, Workspaces
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Workspaces ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Workspace',
  logo_url text,
  default_timezone text NOT NULL DEFAULT 'America/New_York',
  default_language text NOT NULL DEFAULT 'en',
  data_retention_days integer NOT NULL DEFAULT 90,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);

-- Auto-create workspace on first user sign-up
CREATE OR REPLACE FUNCTION create_default_workspace()
RETURNS trigger AS $$
BEGIN
  INSERT INTO workspaces (owner_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)) || '''s Workspace')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_workspace ON auth.users;
CREATE TRIGGER on_auth_user_created_workspace
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_workspace();


-- ─── 2. Workspace Members ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_by uuid NOT NULL REFERENCES auth.users(id),
  email text NOT NULL,
  name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'viewer',
  status text NOT NULL DEFAULT 'invited' CHECK (status IN ('active', 'invited', 'suspended', 'removed')),
  invited_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  last_active timestamptz,
  suspended_at timestamptz,
  suspended_reason text,
  UNIQUE (invited_by, email)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_invited_by ON workspace_members(invited_by);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_email ON workspace_members(email);
CREATE INDEX IF NOT EXISTS idx_workspace_members_status ON workspace_members(status);


-- ─── 3. Roles ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_system boolean NOT NULL DEFAULT false,
  color text NOT NULL DEFAULT 'blue',
  icon text NOT NULL DEFAULT 'Shield',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, slug)
);

-- Insert system roles (workspace_id = NULL for global system roles)
INSERT INTO roles (workspace_id, name, slug, description, is_system, color, icon)
VALUES
  (NULL, 'Owner', 'owner', 'Full access, billing, can delete workspace', true, 'yellow', 'Crown'),
  (NULL, 'Admin', 'admin', 'All features except billing and workspace deletion', true, 'purple', 'Shield'),
  (NULL, 'Manager', 'manager', 'Manage agents, view analytics, manage leads', true, 'blue', 'Briefcase'),
  (NULL, 'Agent', 'agent', 'View assigned calls/chats only', true, 'green', 'Headphones'),
  (NULL, 'Viewer', 'viewer', 'Read-only access to analytics and reports', true, 'gray', 'Eye')
ON CONFLICT DO NOTHING;


-- ─── 4. Role Permissions ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id text NOT NULL,
  PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);


-- ─── 5. Activity Logs ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  user_id uuid,
  user_email text,
  user_name text,
  action text NOT NULL,
  details text NOT NULL DEFAULT '',
  metadata jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_search ON activity_logs USING gin (to_tsvector('english', details));


-- ─── 6. API Keys ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  key_prefix text NOT NULL,
  key_hash text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  expires_at timestamptz,
  last_used_at timestamptz,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  usage_24h integer NOT NULL DEFAULT 0,
  usage_7d integer NOT NULL DEFAULT 0,
  usage_30d integer NOT NULL DEFAULT 0,
  rate_limit integer NOT NULL DEFAULT 60
);

CREATE INDEX IF NOT EXISTS idx_api_keys_workspace ON api_keys(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);


-- ═══════════════════════════════════════════════════════════════════════════
-- RLS Policies
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- ─── Workspaces RLS ────────────────────────────────────────────────────

CREATE POLICY "Users can view their own workspace"
  ON workspaces FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can update their workspace"
  ON workspaces FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their workspace"
  ON workspaces FOR DELETE
  USING (owner_id = auth.uid());

CREATE POLICY "System can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- ─── Workspace Members RLS ─────────────────────────────────────────────

CREATE POLICY "Users can view members they invited"
  ON workspace_members FOR SELECT
  USING (invited_by = auth.uid());

CREATE POLICY "Users can insert members they invite"
  ON workspace_members FOR INSERT
  WITH CHECK (invited_by = auth.uid());

CREATE POLICY "Users can update members they invited"
  ON workspace_members FOR UPDATE
  USING (invited_by = auth.uid());

CREATE POLICY "Users can delete members they invited"
  ON workspace_members FOR DELETE
  USING (invited_by = auth.uid());

-- ─── Roles RLS ─────────────────────────────────────────────────────────

CREATE POLICY "Anyone can view system roles"
  ON roles FOR SELECT
  USING (is_system = true);

CREATE POLICY "Users can view their workspace roles"
  ON roles FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));

CREATE POLICY "Users can create workspace roles"
  ON roles FOR INSERT
  WITH CHECK (workspace_id = auth.uid()::text::uuid OR workspace_id IS NULL);

CREATE POLICY "Users can update their workspace roles"
  ON roles FOR UPDATE
  USING (
    is_system = false
    AND workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can delete their workspace roles"
  ON roles FOR DELETE
  USING (
    is_system = false
    AND workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- ─── Role Permissions RLS ──────────────────────────────────────────────

CREATE POLICY "Anyone can view role permissions"
  ON role_permissions FOR SELECT
  USING (true);

CREATE POLICY "Users can manage role permissions for their roles"
  ON role_permissions FOR INSERT
  WITH CHECK (
    role_id IN (
      SELECT id FROM roles
      WHERE is_system = false
      AND (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
           OR workspace_id = auth.uid()::text::uuid)
    )
  );

CREATE POLICY "Users can delete role permissions for their roles"
  ON role_permissions FOR DELETE
  USING (
    role_id IN (
      SELECT id FROM roles
      WHERE is_system = false
      AND (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
           OR workspace_id = auth.uid()::text::uuid)
    )
  );

-- ─── Activity Logs RLS ─────────────────────────────────────────────────

CREATE POLICY "Users can view their workspace activity logs"
  ON activity_logs FOR SELECT
  USING (workspace_id = auth.uid()::text);

CREATE POLICY "Users can insert activity logs for their workspace"
  ON activity_logs FOR INSERT
  WITH CHECK (workspace_id = auth.uid()::text);

-- ─── API Keys RLS ──────────────────────────────────────────────────────

CREATE POLICY "Users can view their workspace API keys"
  ON api_keys FOR SELECT
  USING (workspace_id = auth.uid()::text);

CREATE POLICY "Users can create API keys for their workspace"
  ON api_keys FOR INSERT
  WITH CHECK (workspace_id = auth.uid()::text AND created_by = auth.uid());

CREATE POLICY "Users can update their workspace API keys"
  ON api_keys FOR UPDATE
  USING (workspace_id = auth.uid()::text);


-- ═══════════════════════════════════════════════════════════════════════════
-- Helper Functions
-- ═══════════════════════════════════════════════════════════════════════════

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id uuid,
  p_permission_key text
)
RETURNS boolean AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role
  FROM workspace_members
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;

  IF v_role IS NULL THEN RETURN false; END IF;
  IF v_role = 'owner' THEN RETURN true; END IF;

  -- Check role_permissions for the permission
  RETURN EXISTS (
    SELECT 1
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    WHERE r.slug = v_role
    AND rp.permission_id = p_permission_key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-expire API keys
CREATE OR REPLACE FUNCTION expire_api_keys()
RETURNS void AS $$
BEGIN
  UPDATE api_keys
  SET status = 'expired'
  WHERE status = 'active'
  AND expires_at IS NOT NULL
  AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
