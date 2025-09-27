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
