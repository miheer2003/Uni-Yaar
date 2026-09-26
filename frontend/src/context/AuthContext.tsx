import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, UserRole, LoginRequest, RegisterRequest } from '../types/auth';
import { authApi, getStoredToken } from '../api/client';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = getStoredToken();
    if (token) {
      try {
        const response = await authApi.getProfile();
        if (response.data.success && response.data.data) {
          const profileData = response.data.data as any;
          setUser({ ...profileData, id: profileData.userId } as User);
        } else {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    let response;
    try {
      response = await authApi.login(credentials);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response?.data as { message?: string; data?: Record<string, string> } | undefined;
        const validationMessage = response?.data ? Object.values(response.data).join(' ') : '';
        throw new Error(validationMessage || response?.message || 'Unable to sign in. Check your email and password.');
      }
      throw error;
    }
    if (response.data.success && response.data.data) {
      const { token, userId, email, fullName, role } = response.data.data;
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      storage.setItem('token', token);
      setUser({ id: userId, email, fullName, role: role as UserRole, createdAt: new Date().toISOString() });
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  };

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    if (response.data.success && response.data.data) {
      const { token, userId, email, fullName, role } = response.data.data;
      localStorage.setItem('token', token);
      setUser({ id: userId, email, fullName, role: role as UserRole, createdAt: new Date().toISOString() });
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
