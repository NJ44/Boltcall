import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, SignupCredentials } from '../lib/auth';
import { login as supabaseLogin, signup as supabaseSignup, logout as supabaseLogout, getCurrentUser, onAuthStateChange, signInWithGoogle, signInWithMicrosoft } from '../lib/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session and listen to auth state changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      if (user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const user = await supabaseLogin(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const user = await supabaseSignup(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabaseLogout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      dispatch({ type: 'LOGIN_START' });
      await signInWithGoogle();
    } catch (error) {
      if (error instanceof Error && error.message === 'OAuth redirect initiated') {
        // This is expected for OAuth redirects
        return;
      }
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      dispatch({ type: 'LOGIN_START' });
      await signInWithMicrosoft();
    } catch (error) {
      if (error instanceof Error && error.message === 'OAuth redirect initiated') {
        // This is expected for OAuth redirects
        return;
      }
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    signInWithGoogle: handleGoogleLogin,
    signInWithMicrosoft: handleMicrosoftLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
