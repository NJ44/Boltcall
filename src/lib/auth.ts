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
  // Get additional user data from our users table
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  if (error || !userData) {
    // If user doesn't exist in our users table, create a basic profile
    const newUser = {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
      company: supabaseUser.user_metadata?.company || '',
      role: 'user' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('users')
      .insert(newUser);

    if (insertError) {
      console.error('Error creating user profile:', insertError);
    }

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      company: newUser.company,
      role: newUser.role,
      createdAt: newUser.created_at
    };
  }

  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    company: userData.company,
    role: userData.role,
    createdAt: userData.created_at
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

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Signup failed');
  }

  return await transformSupabaseUser(data.user);
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
