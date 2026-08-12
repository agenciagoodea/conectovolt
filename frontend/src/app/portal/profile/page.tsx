'use client';

import { User } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-white">Meu perfil</h2>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10"><User className="text-emerald-400" /></div><div><p className="font-medium text-white">{user?.name}</p><p className="text-sm text-slate-400">{user?.email}</p></div></div>
        <dl className="grid gap-4 sm:grid-cols-2"><div><dt className="text-xs text-slate-500">Perfil</dt><dd className="mt-1 text-sm text-slate-200">Motorista</dd></div><div><dt className="text-xs text-slate-500">Identificador</dt><dd className="mt-1 break-all text-sm text-slate-200">{user?.id}</dd></div></dl>
      </div>
    </div>
  );
}
