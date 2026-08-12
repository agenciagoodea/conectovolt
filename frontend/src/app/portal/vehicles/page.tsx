'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Car, Plus, Trash2, X } from 'lucide-react';

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
      await api.post('/vehicles', { brand: form.brand, model: form.model, plate: form.plate, batteryCapacity: form.batteryCapacity ? parseFloat(form.batteryCapacity) : undefined });
      setShowForm(false);
      setForm({ brand: '', model: '', plate: '', batteryCapacity: '' });
      await load();
    } catch {
      setError('Nao foi possivel cadastrar o veiculo.');
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
      setError('Nao foi possivel remover o veiculo.');
    }
  }

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Meus Veiculos</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm"><Plus size={16} /> Novo</button>
      </div>
      {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-xl p-4 border border-slate-800 mb-4 space-y-3">
          <div className="flex items-center justify-between"><h3 className="text-white font-medium text-sm">Cadastrar Veiculo</h3><button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={16} /></button></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-slate-400 mb-1">Marca</label><input placeholder="Tesla" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="input-field text-sm" required /></div>
            <div><label className="block text-xs text-slate-400 mb-1">Modelo</label><input placeholder="Model 3" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="input-field text-sm" required /></div>
            <div><label className="block text-xs text-slate-400 mb-1">Placa</label><input placeholder="ABC-1234" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} className="input-field text-sm" required /></div>
            <div><label className="block text-xs text-slate-400 mb-1">Bateria (kWh)</label><input placeholder="75" type="number" value={form.batteryCapacity} onChange={e => setForm({ ...form, batteryCapacity: e.target.value })} className="input-field text-sm" /></div>
          </div>
          <button type="submit" disabled={submitting} className="bg-emerald-600 disabled:opacity-50 text-white px-4 py-1.5 rounded text-sm">{submitting ? 'Salvando...' : 'Salvar'}</button>
        </form>
      )}
      {vehicles.length === 0 ? (
        <div className="text-center py-12 text-slate-500"><Car className="mx-auto mb-3" size={40} /><p>Nenhum veiculo cadastrado</p></div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Car className="text-blue-400" size={20} /></div>
                <div><p className="text-white font-medium">{v.brand} {v.model}</p><p className="text-slate-400 text-sm">{v.plate}{v.batteryCapacity ? ` | ${v.batteryCapacity} kWh` : ''}</p></div>
              </div>
              <button onClick={() => handleDelete(v.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
