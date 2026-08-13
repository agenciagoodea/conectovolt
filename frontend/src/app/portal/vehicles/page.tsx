'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Car, Plus, Trash2, X, Battery } from 'lucide-react';

interface Vehicle { id: string; brand: string; model: string; plate: string; batteryCapacity: number; }

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ brand: '', model: '', plate: '', batteryCapacity: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data);
    } catch {
      setError('Nao foi possivel carregar seus veiculos.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/vehicles', { brand: form.brand, model: form.model, plate: form.plate.toUpperCase(), batteryCapacity: form.batteryCapacity ? parseFloat(form.batteryCapacity) : undefined });
      setShowForm(false);
      setForm({ brand: '', model: '', plate: '', batteryCapacity: '' });
      await load();
    } catch {
      setError('Nao foi possivel cadastrar.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este veiculo?')) return;
    setError('');
    try {
      await api.delete(`/vehicles/${id}`);
      await load();
    } catch {
      setError('Nao foi possivel remover.');
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2].map((i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: '#111' }} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Meus Veiculos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg"
          style={{ background: '#10b98115', color: '#10b981' }}
        >
          <Plus size={16} /> Novo
        </button>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm text-red-400" style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d44' }}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-4" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-sm">Cadastrar Veiculo</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 active:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Marca</label>
              <input placeholder="Ex: Tesla" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 outline-none" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }} required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Modelo</label>
              <input placeholder="Ex: Model 3" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 outline-none" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }} required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Placa</label>
              <input placeholder="ABC-1234" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })} className="w-full rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 outline-none uppercase" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }} maxLength={7} required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Capacidade da bateria (kWh)</label>
              <input placeholder="Ex: 75" type="number" value={form.batteryCapacity} onChange={(e) => setForm({ ...form, batteryCapacity: e.target.value })} className="w-full rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 outline-none" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }} />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50 active:scale-[0.98] transition-transform"
            style={{ background: '#10b981' }}
          >
            {submitting ? 'Salvando...' : 'SALVAR'}
          </button>
        </form>
      )}

      {vehicles.length === 0 ? (
        <div className="text-center py-16">
          <Car className="mx-auto mb-3 text-slate-700" size={48} />
          <p className="text-slate-500 font-medium">Nenhum veiculo cadastrado</p>
          <p className="text-slate-600 text-xs mt-1">Toque em "Novo" para comecar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="flex items-center gap-4 rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
                <Car className="text-white" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base">{v.brand} {v.model}</p>
                <p className="text-slate-400 text-sm">{v.plate}</p>
                {v.batteryCapacity && (
                  <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                    <Battery size={10} /> {v.batteryCapacity} kWh
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(v.id)}
                className="w-10 h-10 flex items-center justify-center rounded-xl active:scale-95 transition-transform"
                style={{ background: '#7f1d1d22' }}
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
