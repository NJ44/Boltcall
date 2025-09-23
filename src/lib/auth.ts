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

// Mock authentication functions
export const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (credentials.email === 'demo@boltcall.ai' && credentials.password === 'demo123') {
    return {
      id: '1',
      email: credentials.email,
      name: 'Demo User',
      company: 'Boltcall Demo',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
  }
  
  throw new Error('Invalid credentials');
};

export const mockSignup = async (credentials: SignupCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    email: credentials.email,
    name: credentials.name,
    company: credentials.company,
    role: 'user',
    createdAt: new Date().toISOString()
  };
};

export const mockLogout = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};
