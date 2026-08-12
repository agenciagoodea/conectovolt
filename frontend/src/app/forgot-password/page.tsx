'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Mail, ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Email nao encontrado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2">
            <Zap className="text-emerald-400" size={28} />
            ConectoVolt
          </div>
          <p className="text-slate-400 text-sm">Recuperacao de Senha</p>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle className="mx-auto mb-4 text-emerald-400" size={48} />
              <h3 className="text-white font-medium mb-2">Link enviado!</h3>
              <p className="text-slate-400 text-sm mb-4">
                Se o email existir, voce recebera instrucoes para redefinir sua senha.
              </p>
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 text-sm">Voltar para o login</Link>
            </div>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={18} className="text-slate-400" />
                <h3 className="text-white font-medium">Esqueceu a senha?</h3>
              </div>
              <p className="text-sm text-slate-400">Digite seu email para receber o link de recuperacao.</p>
              <div>
                <label htmlFor="email" className="block text-sm text-slate-400 mb-1">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required placeholder="seu@email.com" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar link de recuperacao'}
              </button>
              <div className="text-center pt-2">
                <Link href="/login" className="flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-white">
                  <ArrowLeft size={14} /> Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
