# Supabase Setup Guide

This guide will help you complete the Supabase integration for your Boltcall project.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `boltcall-website`
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env` file in your project root with your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Never commit your `.env` file to version control. It should already be in your `.gitignore`.

## 4. Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run the following SQL commands:

### Create Users Table
```sql
-- Enable Row Level Security
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Create Leads Table
```sql
-- Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public access for lead submissions)
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Create Callbacks Table
```sql
-- Create callbacks table for clients who want to be called back
CREATE TABLE callbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Client information
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  company_name TEXT,
  
  -- Callback details
  preferred_callback_time TIMESTAMP WITH TIME ZONE,
  preferred_time_range VARCHAR(50), -- 'morning', 'afternoon', 'evening', 'anytime'
  timezone VARCHAR(50) DEFAULT 'UTC',
  urgency VARCHAR(20) DEFAULT 'normal', -- 'urgent', 'normal', 'low'
  
  -- Callback status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'cancelled', 'no_answer'
  priority INTEGER DEFAULT 5, -- 1-10 scale, 1 being highest priority
  
  -- Callback notes and context
  callback_reason TEXT,
  notes TEXT,
  special_instructions TEXT,
  
  -- Callback scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  attempted_at TIMESTAMP WITH TIME ZONE,
  attempt_count INTEGER DEFAULT 0,
  
  -- Callback outcome
  outcome VARCHAR(50), -- 'successful', 'no_answer', 'busy', 'wrong_number', 'callback_requested', 'not_interested'
  outcome_notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  
  -- Agent information
  assigned_agent_id UUID REFERENCES auth.users(id),
  agent_notes TEXT,
  
  -- Source tracking
  source VARCHAR(100), -- 'website', 'phone_call', 'email', 'chat', 'referral'
  source_details TEXT,
  
  -- Metadata
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_callbacks_lead_id ON callbacks(lead_id);
CREATE INDEX idx_callbacks_status ON callbacks(status);
CREATE INDEX idx_callbacks_scheduled_at ON callbacks(scheduled_at);
CREATE INDEX idx_callbacks_created_at ON callbacks(created_at);
CREATE INDEX idx_callbacks_assigned_agent ON callbacks(assigned_agent_id);

-- Enable Row Level Security
ALTER TABLE callbacks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can insert callbacks" ON callbacks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view callbacks" ON callbacks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update callbacks" ON callbacks
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete callbacks" ON callbacks
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add constraints
ALTER TABLE callbacks ADD CONSTRAINT valid_status 
  CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled', 'no_answer'));

ALTER TABLE callbacks ADD CONSTRAINT valid_urgency 
  CHECK (urgency IN ('urgent', 'normal', 'low'));

ALTER TABLE callbacks ADD CONSTRAINT valid_priority 
  CHECK (priority >= 1 AND priority <= 10);

ALTER TABLE callbacks ADD CONSTRAINT valid_outcome 
  CHECK (outcome IN ('successful', 'no_answer', 'busy', 'wrong_number', 'callback_requested', 'not_interested', 'voicemail', 'callback_scheduled'));

ALTER TABLE callbacks ADD CONSTRAINT valid_time_range 
  CHECK (preferred_time_range IN ('morning', 'afternoon', 'evening', 'anytime'));
```

### Create Chats Table
```sql
-- Create chats table for storing chat conversations, status, history, and phone information
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Chat identification
  chat_session_id VARCHAR(255) UNIQUE NOT NULL,
  external_chat_id VARCHAR(255),
  
  -- Phone information
  primary_phone VARCHAR(20) NOT NULL,
  secondary_phone VARCHAR(20),
  phone_type VARCHAR(20) DEFAULT 'mobile',
  
  -- Chat participants
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_company VARCHAR(255),
  agent_id UUID REFERENCES auth.users(id),
  
  -- Chat status and state
  status VARCHAR(20) DEFAULT 'active',
  priority VARCHAR(10) DEFAULT 'normal',
  chat_type VARCHAR(20) DEFAULT 'inbound',
  
  -- Chat timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  
  -- Chat configuration
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  source VARCHAR(50) DEFAULT 'website',
  source_details TEXT,
  
  -- Chat content and history
  chat_history JSONB DEFAULT '[]',
  message_count INTEGER DEFAULT 0,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  
  -- Customer context
  customer_sentiment VARCHAR(20),
  customer_intent VARCHAR(50),
  customer_urgency VARCHAR(20) DEFAULT 'normal',
  
  -- Agent notes and tags
  agent_notes TEXT,
  internal_notes TEXT,
  tags TEXT[],
  
  -- Resolution and outcome
  resolution_status VARCHAR(20),
  resolution_notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  
  -- Quality and satisfaction
  customer_satisfaction INTEGER,
  agent_rating INTEGER,
  quality_score DECIMAL(3,2),
  
  -- Integration and external data
  integration_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  
  -- System tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_chats_lead_id ON chats(lead_id);
CREATE INDEX idx_chats_session_id ON chats(chat_session_id);
CREATE INDEX idx_chats_status ON chats(status);
CREATE INDEX idx_chats_agent_id ON chats(agent_id);
CREATE INDEX idx_chats_started_at ON chats(started_at);
CREATE INDEX idx_chats_last_activity ON chats(last_activity_at);
CREATE INDEX idx_chats_primary_phone ON chats(primary_phone);
CREATE INDEX idx_chats_secondary_phone ON chats(secondary_phone);
CREATE INDEX idx_chats_customer_email ON chats(customer_email);
CREATE INDEX idx_chats_source ON chats(source);
CREATE INDEX idx_chats_priority ON chats(priority);
CREATE INDEX idx_chats_chat_type ON chats(chat_type);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can insert chats" ON chats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view chats" ON chats
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update chats" ON chats
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete chats" ON chats
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add constraints
ALTER TABLE chats ADD CONSTRAINT valid_status 
  CHECK (status IN ('active', 'paused', 'closed', 'transferred', 'abandoned'));

ALTER TABLE chats ADD CONSTRAINT valid_priority 
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

ALTER TABLE chats ADD CONSTRAINT valid_chat_type 
  CHECK (chat_type IN ('inbound', 'outbound', 'transfer', 'callback'));

ALTER TABLE chats ADD CONSTRAINT valid_phone_type 
  CHECK (phone_type IN ('mobile', 'landline', 'voip', 'unknown'));

ALTER TABLE chats ADD CONSTRAINT valid_sentiment 
  CHECK (customer_sentiment IN ('positive', 'neutral', 'negative', 'frustrated'));

ALTER TABLE chats ADD CONSTRAINT valid_intent 
  CHECK (customer_intent IN ('inquiry', 'complaint', 'support', 'sales', 'booking', 'general'));

ALTER TABLE chats ADD CONSTRAINT valid_urgency 
  CHECK (customer_urgency IN ('low', 'normal', 'high', 'urgent'));

ALTER TABLE chats ADD CONSTRAINT valid_resolution_status 
  CHECK (resolution_status IN ('resolved', 'unresolved', 'escalated', 'transferred'));

ALTER TABLE chats ADD CONSTRAINT valid_satisfaction_rating 
  CHECK (customer_satisfaction IS NULL OR (customer_satisfaction >= 1 AND customer_satisfaction <= 5));

ALTER TABLE chats ADD CONSTRAINT valid_agent_rating 
  CHECK (agent_rating IS NULL OR (agent_rating >= 1 AND agent_rating <= 5));

ALTER TABLE chats ADD CONSTRAINT valid_quality_score 
  CHECK (quality_score IS NULL OR (quality_score >= 0.00 AND quality_score <= 10.00));
```

### Create Updated At Trigger
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to leads table
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to callbacks table
CREATE TRIGGER update_callbacks_updated_at BEFORE UPDATE ON callbacks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to chats table
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 5. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Configure the following settings:

### General Settings
- **Site URL**: `http://localhost:5173` (for development)
- **Redirect URLs**: Add your production domain when ready

### Email Settings
- **Enable email confirmations**: Toggle ON (recommended)
- **Enable email change confirmations**: Toggle ON
- **Enable email OTP**: Toggle OFF (unless you want passwordless auth)

### Email Templates
You can customize the email templates for:
- Confirm signup
- Reset password
- Change email address
- Magic link (if enabled)

## 6. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your signup/login pages and test:
   - User registration
   - Email verification (check your email)
   - Login with verified account
   - Lead form submission
   - Dashboard access (if implemented)

## 7. Production Deployment

When deploying to production:

1. **Update environment variables** in your hosting platform:
   - Set `VITE_SUPABASE_URL` to your production Supabase URL
   - Set `VITE_SUPABASE_ANON_KEY` to your production anon key

2. **Update Supabase settings**:
   - Add your production domain to **Site URL**
   - Add your production domain to **Redirect URLs**

3. **Optional**: Set up custom domain for your Supabase project

## 8. Security Considerations

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Leads are publicly insertable but only viewable by authenticated users

### API Keys
- The anon key is safe to use in frontend code
- Never expose your service role key in frontend code
- Use environment variables for all sensitive data

### Additional Security
Consider implementing:
- Rate limiting on lead submissions
- Email validation
- CAPTCHA for public forms
- Input sanitization

## 9. Monitoring and Analytics

In your Supabase dashboard, you can monitor:
- **Authentication**: User signups, logins, and sessions
- **Database**: Query performance and usage
- **API**: Request logs and errors
- **Storage**: File uploads (if using Supabase Storage)

## 10. Troubleshooting

### Common Issues

1. **"Invalid credentials" error**:
   - Check your environment variables
   - Verify the Supabase URL and anon key

2. **"Row Level Security" errors**:
   - Ensure RLS policies are correctly set up
   - Check if user is authenticated when required

3. **Email verification not working**:
   - Check spam folder
   - Verify email template configuration
   - Ensure SMTP settings are correct

4. **Database connection errors**:
   - Check your internet connection
   - Verify Supabase project is not paused
   - Check for any database maintenance

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

Once your Supabase integration is working:

1. **Customize the database schema** based on your specific needs
2. **Implement additional features** like:
   - User profile management
   - Dashboard analytics
   - Email notifications
   - File uploads
3. **Set up monitoring** and error tracking
4. **Optimize performance** with proper indexing and caching
5. **Implement backup strategies** for your data

Your Boltcall website is now ready to use Supabase for authentication and data management! 🚀
