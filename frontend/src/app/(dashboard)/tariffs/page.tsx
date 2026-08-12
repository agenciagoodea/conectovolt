'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { DollarSign, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface Tariff {
  id: string;
  name: string;
  pricePerKwh: number;
  isActive: boolean;
  companyId: string;
  company?: Company;
  createdAt: string;
}

export default function TariffsPage() {
  const { user } = useAuth();
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [form, setForm] = useState({ name: '', pricePerKwh: '', companyId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const params = user?.role === 'OPERATOR' ? { company_id: user.companyId } : {};
      const { data } = await api.get('/tariffs', { params });
      setTariffs(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [user]);

  const loadCompanies = useCallback(async () => {
    if (user?.role === 'SUPER_ADMIN') {
      try { const { data } = await api.get('/companies?status=ACTIVE'); setCompanies(data); } catch { /* ignore */ }
    }
  }, [user]);

  useEffect(() => { void load(); void loadCompanies(); }, [load, loadCompanies]);

  const openCreate = useCallback(() => {
    setEditingTariff(null);
    setForm({ name: '', pricePerKwh: '', companyId: user?.companyId || '' });
    setError('');
    setShowForm(true);
  }, [user?.companyId]);

  const openEdit = useCallback((t: Tariff) => {
    setEditingTariff(t);
    setForm({ name: t.name, pricePerKwh: String(t.pricePerKwh), companyId: t.companyId });
    setError('');
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        pricePerKwh: parseFloat(form.pricePerKwh),
        companyId: user?.role === 'SUPER_ADMIN' ? form.companyId : user?.companyId,
      };
      if (editingTariff) {
        await api.patch(`/tariffs/${editingTariff.id}`, { name: payload.name, pricePerKwh: payload.pricePerKwh });
      } else {
        await api.post('/tariffs', payload);
      }
      setShowForm(false);
      void load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar tarifa';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [form, editingTariff, user, load]);

  const handleToggle = useCallback(async (id: string) => {
    setError('');
    try {
      await api.post(`/tariffs/${id}/toggle`);
      void load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar tarifa');
    }
  }, [load]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta tarifa?')) return;
    setError('');
    try {
      await api.delete(`/tariffs/${id}`);
      void load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao remover tarifa');
    }
  }, [load]);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-40 bg-slate-800 rounded mb-6 animate-pulse" />
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800 rounded mb-2 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tarifas</h2>
        <button onClick={openCreate} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Nova Tarifa
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6 space-y-4">
          {error && <div className="mb-4 p-3 rounded-lg border bg-red-500/10 border-red-500/20 text-red-400 text-sm">{error}</div>}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">{editingTariff ? 'Editar Tarifa' : 'Nova Tarifa'}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Nome da tarifa" value={form.name} onChange={(e) => { setError(''); setForm({ ...form, name: e.target.value }); }} className="input-field" required />
            <input placeholder="Preco por kWh (R$)" type="number" step="0.01" min="0" value={form.pricePerKwh} onChange={(e) => { setError(''); setForm({ ...form, pricePerKwh: e.target.value }); }} className="input-field" required />
            {user?.role === 'SUPER_ADMIN' && (
              <select value={form.companyId} onChange={(e) => { setError(''); setForm({ ...form, companyId: e.target.value }); }} className="input-field" required>
                <option value="">Selecione a empresa</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">{submitting ? 'Salvando...' : 'Salvar'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg text-sm">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tariffs.map((t) => (
          <div key={t.id} className={`bg-slate-900 rounded-xl border p-5 transition-colors ${t.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-red-900/30 opacity-70'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium">{t.name}</h3>
                  {t.company && <p className="text-xs text-slate-500">{t.company.name}</p>}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${t.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {t.isActive ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-3">R$ {Number(t.pricePerKwh).toFixed(2)}<span className="text-sm text-slate-400 font-normal">/kWh</span></p>
            <div className="flex gap-2 pt-3 border-t border-slate-800">
              <button onClick={() => handleToggle(t.id)} className={`flex-1 p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${t.isActive ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                {t.isActive ? <><ToggleRight size={14} /> Desativar</> : <><ToggleLeft size={14} /> Ativar</>}
              </button>
              <button onClick={() => openEdit(t)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" title="Editar">
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20" title="Remover">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {tariffs.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">Nenhuma tarifa cadastrada</div>
        )}
      </div>
    </div>
  );
}
