'use client';

import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import api from '@/lib/api';
import { User, Mail, Phone, Shield, LogOut, Camera, Save, Check, X } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const { data } = await api.patch('/auth/profile', form);
      updateUser(data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEditing(false);
      }, 1500);
    } catch {
      setError('Nao foi possivel salvar.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm({ name: user?.name || '', phone: user?.phone || '' });
    setEditing(false);
    setError('');
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-white">Perfil</h1>

      <div className="rounded-2xl p-5 text-center" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
        <div className="relative w-20 h-20 rounded-full mx-auto mb-3">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <User className="text-white" size={32} />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#1f1f1f', border: '2px solid #0a0a0a' }}>
            <Camera size={12} className="text-slate-400" />
          </button>
        </div>
        <p className="text-white font-bold text-lg">{user?.name || 'Motorista'}</p>
        <p className="text-slate-400 text-sm mt-0.5">{user?.email || ''}</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #1f1f1f' }}>
          <Mail size={18} className="text-slate-500" />
          <div className="flex-1">
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-white text-sm">{user?.email || '-'}</p>
          </div>
        </div>

        {editing ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #1f1f1f' }}>
              <User size={18} className="text-slate-500" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Nome</p>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg py-2 px-3 text-sm text-white outline-none"
                  style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #1f1f1f' }}>
              <Phone size={18} className="text-slate-500" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Telefone</p>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+5511999999999"
                  className="w-full rounded-lg py-2 px-3 text-sm text-white placeholder-slate-600 outline-none"
                  style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #1f1f1f' }}>
              <User size={18} className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Nome</p>
                <p className="text-white text-sm">{user?.name || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #1f1f1f' }}>
              <Phone size={18} className="text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Telefone</p>
                <p className="text-white text-sm">{user?.phone || 'Nao informado'}</p>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-3 px-4 py-3.5">
          <Shield size={18} className="text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Funcao</p>
            <p className="text-white text-sm">Motorista</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm text-red-400" style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d44' }}>
          {error}
        </div>
      )}

      {editing ? (
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold active:scale-[0.98] transition-transform"
            style={{ background: '#1f1f1f', color: '#94a3b8' }}
          >
            <X size={18} /> Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || success}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
            style={{ background: success ? '#064e3b' : '#10b981', color: '#fff' }}
          >
            {success ? <><Check size={18} /> Salvo!</> : saving ? 'Salvando...' : <><Save size={18} /> Salvar</>}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold active:scale-[0.98] transition-transform"
          style={{ background: '#10b98115', color: '#10b981' }}
        >
          <User size={18} /> Editar perfil
        </button>
      )}

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
