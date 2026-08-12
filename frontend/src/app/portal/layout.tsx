'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Zap, LogOut, Car, MapPin, History, Home, User } from 'lucide-react';

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
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="text-emerald-400" size={22} />
            <span className="text-white font-bold">ConectoVolt</span>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/portal" className="flex items-center gap-1 text-slate-300 hover:text-white px-3 py-1.5 rounded text-sm"><Home size={16} /> Inicio</Link>
            <Link href="/portal/stations" className="flex items-center gap-1 text-slate-300 hover:text-white px-3 py-1.5 rounded text-sm"><MapPin size={16} /> Postos</Link>
            <Link href="/portal/vehicles" className="flex items-center gap-1 text-slate-300 hover:text-white px-3 py-1.5 rounded text-sm"><Car size={16} /> Veiculos</Link>
            <Link href="/portal/history" className="flex items-center gap-1 text-slate-300 hover:text-white px-3 py-1.5 rounded text-sm"><History size={16} /> Historico</Link>
            <Link href="/portal/profile" className="flex items-center gap-1 text-slate-300 hover:text-white px-3 py-1.5 rounded text-sm"><User size={16} /> Perfil</Link>
            <button onClick={logout} className="flex items-center gap-1 text-slate-400 hover:text-white px-3 py-1.5 rounded text-sm ml-2"><LogOut size={16} /> Sair</button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
