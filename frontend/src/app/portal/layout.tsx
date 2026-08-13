'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Zap, Home, MapPin, Car, History, User } from 'lucide-react';

const TABS = [
  { href: '/portal', label: 'Inicio', icon: Home },
  { href: '/portal/stations', label: 'Postos', icon: MapPin },
  { href: '/portal/vehicles', label: 'Veiculos', icon: Car },
  { href: '/portal/history', label: 'Historico', icon: History },
  { href: '/portal/profile', label: 'Perfil', icon: User },
];

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      <div className="flex items-center justify-center" style={{ height: '100dvh' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
      </div>
    );
  }

  if (!user || user.role !== 'CUSTOMER') return null;

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto" style={{ height: '100dvh', background: '#0a0a0a' }}>
      <header className="flex items-center justify-between px-4 h-12 shrink-0" style={{ background: '#0f0f0f', borderBottom: '1px solid #1a1a1a' }}>
        <div className="flex items-center gap-2">
          <Zap className="text-emerald-400" size={18} />
          <span className="text-white font-bold text-sm">ConectoVolt</span>
        </div>
        <button onClick={logout} className="text-slate-500 text-xs">Sair</button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">{children}</main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]" style={{ background: '#0f0f0f', borderTop: '1px solid #1a1a1a' }}>
        {TABS.map((tab) => {
          const active = pathname === tab.href || (tab.href !== '/portal' && pathname.startsWith(tab.href));
          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <tab.icon size={20} className={active ? 'text-emerald-400' : 'text-slate-500'} />
              <span className={`text-[10px] ${active ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
