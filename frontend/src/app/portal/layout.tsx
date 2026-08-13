'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Zap, LogOut } from 'lucide-react';

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'CUSTOMER') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
      </div>
    );
  }

  if (!user || user.role !== 'CUSTOMER') return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-emerald-400" size={20} />
            <span className="text-white font-bold text-sm">ConectoVolt</span>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-slate-400 hover:text-white px-2 py-1.5 rounded text-xs">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-5">{children}</main>
    </div>
  );
}
