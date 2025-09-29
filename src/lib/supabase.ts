import { createClient } from '@supabase/supabase-js'

// You'll need to set these environment variables in your .env file:
// VITE_SUPABASE_URL=your_supabase_project_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbwogktdajorojljkjwg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhid29na3RkYWpvcm9qbGprandnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5Nzk3OTAsImV4cCI6MjA3NDU1NTc5MH0.5OGNa0_WfxPMFqxj9sY4Tq6WZtOaxjejS7Z4HNzbe7w'

// Create the Supabase client with fallback credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default supabase;