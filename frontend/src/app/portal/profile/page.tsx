'use client';

import { useAuth } from '@/lib/auth';
import { User, Mail, Shield, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-white">Perfil</h1>

      <div className="rounded-2xl p-5 text-center" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
        <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' }}>
          <User className="text-white" size={32} />
        </div>
        <p className="text-white font-bold text-lg">{user?.name || 'Motorista'}</p>
        <p className="text-slate-400 text-sm mt-0.5">{user?.email || ''}</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #1f1f1f' }}>
          <Mail size={18} className="text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-white text-sm">{user?.email || '-'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #1f1f1f' }}>
          <Shield size={18} className="text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Funcao</p>
            <p className="text-white text-sm">Motorista</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <User size={18} className="text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">ID do usuario</p>
            <p className="text-white text-xs font-mono">{user?.id || '-'}</p>
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold active:scale-[0.98] transition-transform"
        style={{ background: '#7f1d1d33', color: '#ef4444' }}
      >
        <LogOut size={18} /> Sair da conta
      </button>
    </div>
  );
}
