'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import api, { AUTH_LOGOUT_EVENT } from './api';

const AUTH_COOKIE = 'auth_session';

function setAuthCookie() {
  if (typeof document !== 'undefined') {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=604800; SameSite=Lax${secure}`;
  }
}

function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
  phone?: string;
  avatarUrl?: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleForcedLogout = () => {
      clearAuthCookie();
      setUser(null);
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);

    const token = localStorage.getItem('access_token');
    if (token) {
      void loadProfile();
    } else {
      setLoading(false);
    }

    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    setAuthCookie();
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post<LoginResponse>('/auth/register', {
        name,
        email,
        password,
      });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setAuthCookie();
      setUser(data.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort: even if the request fails, clear local state.
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    clearAuthCookie();
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
