import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, UserRole, LoginRequest, RegisterRequest } from '../types/auth';
import { authApi } from '../api/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authApi.getProfile();
        if (response.data.success && response.data.data) {
          setUser(response.data.data as unknown as User);
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    if (response.data.success && response.data.data) {
      const { token, userId, email, fullName, role } = response.data.data;
      localStorage.setItem('token', token);
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