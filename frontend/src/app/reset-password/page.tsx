'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { CheckCircle, LockKeyhole, Zap } from 'lucide-react';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token') || '');
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (!token) return setError('Token de recuperacao ausente.');
    if (password !== confirmation) return setError('As senhas nao coincidem.');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, new_password: password });
      setDone(true);
    } catch {
      setError('Token invalido ou expirado. Solicite uma nova recuperacao.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-8 text-center"><Zap className="mx-auto text-emerald-400" size={32} /><h1 className="mt-2 text-2xl font-bold text-white">Nova senha</h1><p className="mt-1 text-sm text-slate-400">Redefina o acesso da sua conta.</p></div>
        {done ? <div className="py-6 text-center"><CheckCircle className="mx-auto text-emerald-400" size={48} /><p className="mt-3 text-white">Senha alterada com sucesso.</p><Link href="/login" className="mt-5 inline-block text-sm text-emerald-400">Voltar para o login</Link></div> : <form onSubmit={submit} className="space-y-4"><label className="block text-sm text-slate-400">Nova senha<input type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="input-field mt-1" required /></label><label className="block text-sm text-slate-400">Confirmar senha<input type="password" minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="input-field mt-1" required /></label>{error && <p className="text-sm text-red-400">{error}</p>}<button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"><LockKeyhole size={16} />{loading ? 'Salvando...' : 'Redefinir senha'}</button></form>}
      </div>
    </div>
  );
}
