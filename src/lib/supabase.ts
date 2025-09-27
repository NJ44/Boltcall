import { createClient } from '@supabase/supabase-js'

// You'll need to set these environment variables in your .env file:
// VITE_SUPABASE_URL=your_supabase_project_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
  
  // Don't throw error in development, create a mock client instead
  if (import.meta.env.DEV) {
    console.warn('Creating mock Supabase client for development')
    // Create a mock client that won't crash the app
    supabase = {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
        eq: function() { return this; },
        single: function() { return this; }
      })
    };
  } else {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
  }
} else {
  // Create the actual Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export { supabase };

// Database types (you can generate these from your Supabase dashboard)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          company: string
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          company: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          company?: string
          role?: 'admin' | 'user'
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          company: string
          website: string | null
          phone: string | null
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company: string
          website?: string | null
          phone?: string | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string
          website?: string | null
          phone?: string | null
          message?: string | null
          updated_at?: string
        }
      }
    }
  }
}

// Typed Supabase client
export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>
