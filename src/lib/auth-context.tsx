'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/data/types';

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

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'user@demo.com': {
    password: 'demo123',
    user: { id: '1', email: 'user@demo.com', name: 'Alex Morgan', role: 'user', createdAt: new Date('2026-01-15'), lastLogin: new Date('2026-09-03T07:00:00') },
  },
  'analyst@demo.com': {
    password: 'demo123',
    user: { id: '2', email: 'analyst@demo.com', name: 'Sarah Chen', role: 'analyst', createdAt: new Date('2025-11-20'), lastLogin: new Date('2026-09-02T08:30:00') },
  },
  'admin@demo.com': {
    password: 'demo123',
    user: { id: '3', email: 'admin@demo.com', name: 'Marcus Webb', role: 'admin', createdAt: new Date('2025-09-01'), lastLogin: new Date('2026-09-03T06:45:00') },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const entry = DEMO_USERS[email];
    if (entry) {
      const userData = { ...entry.user };
      if (role) userData.role = role;
      userData.lastLogin = new Date();
      setUser(userData);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newUser: User = { id: Date.now().toString(), email, name, role: 'user', createdAt: new Date() };
    setUser(newUser);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
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
