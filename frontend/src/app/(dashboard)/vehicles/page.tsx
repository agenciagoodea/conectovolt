'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Car, Plus, Pencil, Trash2, Battery, X, ShieldAlert, Camera, Upload } from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  batteryCapacity?: number;
  createdAt: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({ brand: '', model: '', plate: '', batteryCapacity: '' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecione um arquivo de imagem valido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A foto deve ter no maximo 5MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = useCallback(() => {
    setEditingVehicle(null);
    setForm({ brand: '', model: '', plate: '', batteryCapacity: '' });
    setError('');
    setShowForm(true);
  }, []);

  const openEdit = useCallback((v: Vehicle) => {
    setEditingVehicle(v);
    setForm({
      brand: v.brand,
      model: v.model,
      plate: v.plate,
      batteryCapacity: v.batteryCapacity ? String(v.batteryCapacity) : '',
    });
    setError('');
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      try {
        const payload = {
          brand: form.brand,
          model: form.model,
          plate: form.plate,
          batteryCapacity: form.batteryCapacity ? parseFloat(form.batteryCapacity) : undefined,
        };
        if (editingVehicle) {
          await api.patch(`/vehicles/${editingVehicle.id}`, payload);
        } else {
          await api.post('/vehicles', payload);
        }
        setShowForm(false);
        void load();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar veículo';
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [form, editingVehicle, load]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Tem certeza que deseja remover este veículo?')) return;
      setError('');
      try {
        await api.delete(`/vehicles/${id}`);
        void load();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao remover veículo');
      }
    },
    [load]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-900/80 border border-slate-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 h-36 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Car className="text-emerald-400" size={24} /> Meus Veículos Elétricos
          </h2>
          <p className="text-sm text-slate-400 mt-1">Cadastre e gerencie sua frota ou veículos pessoais para recarga</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <Plus size={18} /> Novo Veículo
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl backdrop-blur space-y-6"
        >
          {error && (
            <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <ShieldAlert size={16} /> <span>{error}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingVehicle ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* FOTO DO VEÍCULO */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="relative group">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview Veiculo"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400">
                  <Camera size={28} className="mb-1 text-slate-500" />
                  <span className="text-[10px]">Sem Foto</span>
                </div>
              )}
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-colors"
                  title="Remover foto"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h4 className="text-sm font-medium text-white flex items-center justify-center sm:justify-start gap-1.5">
                <Camera size={16} className="text-emerald-400" /> Foto do Veículo
              </h4>
              <p className="text-xs text-slate-400 max-w-md">
                Envie uma foto do seu veículo elétrico (PNG, JPG ou WebP até 5MB).
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                id="vehicle-photo-upload"
              />

              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                <label
                  htmlFor="vehicle-photo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-slate-700 hover:border-emerald-500/30 transition-all shadow-sm"
                >
                  <Upload size={14} /> {photoPreview ? 'Alterar Foto' : 'Selecionar Foto do Veículo'}
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="text-xs text-slate-400 hover:text-red-400 underline transition-colors"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Marca / Fabricante</label>
              <input
                placeholder="Ex: BYD / Tesla / Volvo"
                value={form.brand}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, brand: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Modelo</label>
              <input
                placeholder="Ex: Dolphin / Model 3 / XC40"
                value={form.model}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, model: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Placa do Veículo</label>
              <input
                placeholder="ABC1D23"
                value={form.plate}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, plate: e.target.value.toUpperCase() });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono uppercase outline-none"
                required
                maxLength={7}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Capacidade Bateria (kWh)</label>
              <input
                placeholder="Ex: 60"
                type="number"
                step="0.1"
                min="0"
                value={form.batteryCapacity}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, batteryCapacity: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Salvar Veículo'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all shadow-xl backdrop-blur space-y-4 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-snug">
                    {v.brand} {v.model}
                  </h3>
                  <span className="inline-block mt-0.5 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {v.plate}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(v)}
                  className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  title="Editar"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Remover"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <Battery size={15} className="text-emerald-400" />
                <span>{v.batteryCapacity ? `${Number(v.batteryCapacity).toFixed(0)} kWh` : 'Capacidade N/I'}</span>
              </div>
              <span>{new Date(v.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            Nenhum veículo cadastrado. Clique no botão acima para adicionar seu primeiro veículo.
          </div>
        )}
      </div>
    </div>
  );
}
