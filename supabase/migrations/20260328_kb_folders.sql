-- KB Folders System
-- Groups knowledge_base documents into named folders that can be attached to agents

-- 1. KB Folders table
CREATE TABLE IF NOT EXISTS kb_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'folder',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Join table: agents <-> kb_folders (many-to-many)
CREATE TABLE IF NOT EXISTS agent_kb_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  kb_folder_id UUID NOT NULL REFERENCES kb_folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, kb_folder_id)
);

-- 3. Add folder FK to existing knowledge_base table
ALTER TABLE knowledge_base ADD COLUMN IF NOT EXISTS kb_folder_id UUID REFERENCES kb_folders(id) ON DELETE SET NULL;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_kb_folders_user_id ON kb_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_kb_folders_business_profile_id ON kb_folders(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_kb_folders_is_default ON kb_folders(is_default);
CREATE INDEX IF NOT EXISTS idx_agent_kb_folders_agent_id ON agent_kb_folders(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_kb_folders_kb_folder_id ON agent_kb_folders(kb_folder_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_kb_folder_id ON knowledge_base(kb_folder_id);

-- 5. RLS policies for kb_folders
ALTER TABLE kb_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own KB folders" ON kb_folders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KB folders" ON kb_folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KB folders" ON kb_folders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own KB folders" ON kb_folders
  FOR DELETE USING (auth.uid() = user_id);

-- 6. RLS policies for agent_kb_folders
ALTER TABLE agent_kb_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their agent-folder links" ON agent_kb_folders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_kb_folders.agent_id AND agents.user_id = auth.uid())
  );

CREATE POLICY "Users can insert their agent-folder links" ON agent_kb_folders
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_kb_folders.agent_id AND agents.user_id = auth.uid())
  );

CREATE POLICY "Users can delete their agent-folder links" ON agent_kb_folders
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM agents WHERE agents.id = agent_kb_folders.agent_id AND agents.user_id = auth.uid())
  );

-- 7. Updated_at trigger for kb_folders
CREATE TRIGGER update_kb_folders_updated_at BEFORE UPDATE ON kb_folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Backfill: Create "Business Profile" folder for existing users with KB docs
-- and link to their existing agents
DO $$
DECLARE
  r RECORD;
  folder_id UUID;
BEGIN
  -- For each user that has KB docs but no folders yet
  FOR r IN
    SELECT DISTINCT kb.user_id, kb.business_profile_id
    FROM knowledge_base kb
    WHERE kb.kb_folder_id IS NULL
      AND kb.business_profile_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM kb_folders kf WHERE kf.user_id = kb.user_id AND kf.is_default = true
      )
  LOOP
    -- Create default folder
    INSERT INTO kb_folders (business_profile_id, user_id, name, description, icon, is_default)
    VALUES (r.business_profile_id, r.user_id, 'Business Profile', 'Your core business information, services, FAQs, and policies', 'building', true)
    RETURNING id INTO folder_id;

    -- Assign all orphan KB docs to this folder
    UPDATE knowledge_base
    SET kb_folder_id = folder_id
    WHERE user_id = r.user_id AND kb_folder_id IS NULL;

    -- Link folder to all user's agents
    INSERT INTO agent_kb_folders (agent_id, kb_folder_id)
    SELECT a.id, folder_id
    FROM agents a
    WHERE a.user_id = r.user_id
    ON CONFLICT (agent_id, kb_folder_id) DO NOTHING;
  END LOOP;
END;
$$;
