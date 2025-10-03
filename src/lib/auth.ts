import { supabase } from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  company: string;
}

// Helper function to transform Supabase user to our User interface
const transformSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  console.log('Transforming Supabase user:', supabaseUser);
  
  // For now, just use the Supabase user data directly without custom users table
  // This avoids the hanging issue with missing users table
  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
    company: supabaseUser.user_metadata?.company || '',
    role: 'user' as const,
    createdAt: supabaseUser.created_at || new Date().toISOString()
  };
};

// Supabase authentication functions
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Login failed');
  }

  return await transformSupabaseUser(data.user);
};

export const signup = async (credentials: SignupCredentials): Promise<User> => {
  console.log('Starting signup process with credentials:', { ...credentials, password: '[HIDDEN]' });
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
          company: credentials.company,
        }
      }
    });

    console.log('Supabase signup response:', { data, error });

    if (error) {
      console.error('Supabase signup error:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      console.error('No user returned from Supabase signup');
      throw new Error('Signup failed - no user returned');
    }

    console.log('Supabase user created, transforming...');
    const transformedUser = await transformSupabaseUser(data.user);
    console.log('User transformation complete:', transformedUser);
    
    return transformedUser;
  } catch (error) {
    console.error('Signup function error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return await transformSupabaseUser(user);
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange(async (_event: string, session: { user: SupabaseUser } | null) => {
    if (session?.user) {
      const user = await transformSupabaseUser(session.user);
      callback(user);
    } else {
      callback(null);
    }
  });
};

export const signInWithGoogle = async (): Promise<User> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'openid email profile',
      queryParams: { access_type: 'offline', prompt: 'consent' }
    }
  });
  if (error) throw new Error(error.message);
  throw new Error('OAuth redirect initiated');
};

export const signInWithMicrosoft = async (): Promise<User> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'openid email profile',
      queryParams: { access_type: 'offline', prompt: 'consent' }
    }
  });
  if (error) throw new Error(error.message);
  throw new Error('OAuth redirect initiated');
};
