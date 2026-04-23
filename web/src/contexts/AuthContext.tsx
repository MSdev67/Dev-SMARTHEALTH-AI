'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Restore session ──────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setIsLoading(false); return; }
      try {
        const profile = await authAPI.getProfile();
        setUser(profile);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── Login ────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user: userData } = await authAPI.login(email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // ── Register ─────────────────────────────────────────────
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user: userData } = await authAPI.register(data);
      localStorage.setItem('token', token);
      setUser(userData);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // ── Logout ───────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  // ── Update profile ───────────────────────────────────────
  const updateUser = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const updated = await authAPI.updateProfile(data);
      setUser(updated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, register, logout, updateUser, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};