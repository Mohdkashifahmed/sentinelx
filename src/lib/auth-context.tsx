'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/data/types';
import { authApi, setToken, clearToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if there's a stored token and fetch profile
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sentinelx_token') : null;
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi.me()
      .then((data) => {
        setUser({
          id: String(data.id),
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          createdAt: new Date(data.createdAt),
          lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined,
        });
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      setToken(data.accessToken);
      setUser({
        id: String(data.user.id),
        email: data.user.email,
        name: data.user.name,
        role: (role || data.user.role) as UserRole,
        createdAt: new Date(),
        lastLogin: new Date(),
      });
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await authApi.register(name, email, password);
      setToken(data.accessToken);
      setUser({
        id: String(data.user.id),
        email: data.user.email,
        name: data.user.name,
        role: data.user.role as UserRole,
        createdAt: new Date(),
      });
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser((prev) => prev ? { ...prev, role } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
