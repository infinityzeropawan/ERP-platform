'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'superadmin' | 'school_admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string; name: string; email: string; role: UserRole;
  phone?: string; joiningDate?: string; qualification?: string;
  bloodGroup?: string; gender?: string; emergencyPhone?: string;
  rollNo?: string; class?: string; section?: string;
  fatherName?: string; motherName?: string; dob?: string;
  address?: string; busNumber?: string; busRoute?: string;
  admissionDate?: string; profileColor?: string;
  institutionSlug?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);
    let refreshRequest: Promise<string | null> | null = null;

    window.fetch = async (input, init = {}) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (!url.startsWith('/api/') || url.includes('/auth/refresh')) return originalFetch(input, init);

      const accessToken = localStorage.getItem('buildroonix_token');
      const headers = new Headers(init.headers);
      if (accessToken && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${accessToken}`);
      let response = await originalFetch(input, { ...init, headers });

      if (response.status === 401 || response.status === 403) {
        if (url.includes('/auth/')) return response;
        refreshRequest ??= originalFetch('/api/v1/auth/refresh', {
          method: 'POST',
        }).then(async refreshResponse => {
          if (!refreshResponse.ok) return null;
          const refreshed = await refreshResponse.json();
          localStorage.setItem('buildroonix_token', refreshed.token);
          setToken(refreshed.token);
          return refreshed.token as string;
        }).finally(() => { refreshRequest = null; });
        const nextToken = await refreshRequest;
        if (nextToken) {
          headers.set('Authorization', `Bearer ${nextToken}`);
          response = await originalFetch(input, { ...init, headers });
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('buildroonix_user');
          localStorage.removeItem('buildroonix_token');
          router.push('/login');
        }
      }
      return response;
    };

    const stored = localStorage.getItem('buildroonix_user');
    const storedToken = localStorage.getItem('buildroonix_token');
    queueMicrotask(() => {
      if (stored) setUser(JSON.parse(stored));
      if (storedToken) setToken(storedToken);
    });
    return () => { window.fetch = originalFetch; };
  }, [router]);

  const login = (userData: User, tokenVal: string) => {
    setUser(userData);
    setToken(tokenVal);
    localStorage.setItem('buildroonix_user', JSON.stringify(userData));
    localStorage.setItem('buildroonix_token', tokenVal);
    if (userData.role === 'superadmin') router.push('/superadmin');
    else if (userData.role === 'school_admin') router.push('/admin');
    else if (userData.role === 'teacher') router.push('/teacher');
    else if (userData.role === 'parent') router.push('/parent');
    else router.push('/student');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('buildroonix_user');
    localStorage.removeItem('buildroonix_token');
    localStorage.removeItem('buildroonix_my_institution');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
