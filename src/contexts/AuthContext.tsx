/**
 * AuthContext — lightweight context definition.
 *
 * Intentionally has NO runtime import of auth.ts / supabase.ts so this module
 * stays out of the critical-path bundle on marketing pages. Only `import type`
 * is used for TypeScript types (erased at build time).
 *
 * The actual AuthProvider (with Supabase) lives in AuthProvider.tsx and is
 * lazy-loaded in AppRoutes.tsx so it never ends up in the modulepreload list.
 */
import { createContext, useContext } from 'react';
import type { User, AuthState, LoginCredentials, SignupCredentials } from '../lib/auth';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
}

// Safe no-op default — used before AuthProvider hydrates (~200 ms on first load).
// isLoading:true means ProtectedRoute shows a spinner rather than redirecting.
const noop = async () => {};

export const AuthContext = createContext<AuthContextType>({
  user: null as User | null,
  isAuthenticated: false,
  isLoading: true,
  login: noop,
  signup: noop,
  logout: noop,
  signInWithGoogle: noop,
  signInWithMicrosoft: noop,
  signInWithFacebook: noop,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
