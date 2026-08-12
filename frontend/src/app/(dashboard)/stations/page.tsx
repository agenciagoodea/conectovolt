'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, MapPin, Search, Loader2, Building, CheckCircle2, AlertCircle, X, Camera, Upload, DollarSign } from 'lucide-react';
import DataTable from '@/components/data-table';

interface Company {
  id: string;
  name: string;
}

interface Tariff {
  id: string;
  name: string;
  pricePerKwh: number;
  isActive: boolean;
}

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  status: string;
  latitude: number;
  longitude: number;
  company?: Company;
  tariff?: { id: string; name: string };
  tariffId?: string;
  chargers?: { id: string }[];
  _count?: { chargers: number };
}

const STATUS_LABELS: Record<string, string> = { ACTIVE: 'Ativo', INACTIVE: 'Inativo', MAINTENANCE: 'Manutenção' };

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);

  // CEP Address states
  const [cep, setCep] = useState('');
  const [searchingCep, setSearchingCep] = useState(false);
  const [cepSuccess, setCepSuccess] = useState(false);
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');

  const [form, setForm] = useState({
    name: '',
    companyId: '',
    address: '',
    city: '',
    state: '',
    latitude: '0',
    longitude: '0',
    tariffId: '',
  });

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
      const { data } = await api.get('/stations');
      setStations(data);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const loadCompanies = useCallback(async () => {
    try {
      const { data } = await api.get('/companies?status=ACTIVE');
      setCompanies(data);
    } catch {
      /* ignore */
    }
  }, []);

  const loadTariffs = useCallback(async () => {
    try {
      const { data } = await api.get('/tariffs');
      setTariffs(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
    void loadCompanies();
    void loadTariffs();
  }, [load, loadCompanies, loadTariffs]);

  // Handle CEP lookup
  const handleCepSearch = async (targetCep: string) => {
    const cleanCep = targetCep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setSearchingCep(true);
    setError('');
    setCepSuccess(false);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        setError('CEP não encontrado. Por favor verifique o código digitado.');
        setSearchingCep(false);
        return;
      }

      setStreet(data.logradouro || '');
      setNeighborhood(data.bairro || '');
      setForm((prev) => ({
        ...prev,
        city: data.localidade || '',
        state: (data.uf || '').toUpperCase(),
      }));
      setCepSuccess(true);
    } catch {
      setError('Erro ao buscar CEP. Verifique sua conexão.');
    } finally {
      setSearchingCep(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length > 5) {
      val = `${val.slice(0, 5)}-${val.slice(5)}`;
    }
    setCep(val);
    if (val.replace(/\D/g, '').length === 8) {
      void handleCepSearch(val);
    }
  };

  // Keep full address synchronized when street, number, complement, neighborhood change
  useEffect(() => {
    if (street || number || neighborhood) {
      const formattedAddress = [
        street,
        number ? `nº ${number}` : '',
        complement ? complement : '',
        neighborhood,
      ]
        .filter(Boolean)
        .join(', ');
      setForm((prev) => ({ ...prev, address: formattedAddress }));
    }
  }, [street, number, complement, neighborhood]);

  const openCreate = useCallback(() => {
    setEditingStation(null);
    setForm({ name: '', companyId: '', address: '', city: '', state: '', latitude: '0', longitude: '0', tariffId: '' });
    setCep('');
    setStreet('');
    setNeighborhood('');
    setNumber('');
    setComplement('');
    setCepSuccess(false);
    setError('');
    setShowForm(true);
  }, []);

  const openEdit = useCallback((s: Station) => {
    setEditingStation(s);
    setForm({
      name: s.name,
      companyId: s.company?.id || '',
      address: s.address,
      city: s.city,
      state: s.state,
      latitude: String(s.latitude || 0),
      longitude: String(s.longitude || 0),
      tariffId: s.tariffId || '',
    });
    setCep('');
    setStreet(s.address);
    setNeighborhood('');
    setNumber('');
    setComplement('');
    setCepSuccess(false);
    setError('');
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      try {
        const coordinates = { latitude: parseFloat(form.latitude) || 0, longitude: parseFloat(form.longitude) || 0 };
        if (editingStation) {
          await api.patch(`/stations/${editingStation.id}`, {
            name: form.name,
            address: form.address,
            city: form.city,
            state: form.state,
            tariffId: form.tariffId || null,
            ...coordinates,
          });
        } else {
          await api.post('/stations', { ...form, tariffId: form.tariffId || null, ...coordinates });
        }
        setShowForm(false);
        void load();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar posto';
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [form, editingStation, load]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Tem certeza que deseja remover este posto?')) return;
      setError('');
      try {
        await api.delete(`/stations/${id}`);
        void load();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao remover posto');
      }
    },
    [load]
  );

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      INACTIVE: 'bg-red-500/10 text-red-400 border-red-500/30',
      MAINTENANCE: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles[status] || styles.ACTIVE}`}>
        {STATUS_LABELS[status] || status}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      header: 'Posto',
      render: (s: Station) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MapPin size={16} />
          </div>
          <div>
            <div className="text-white font-medium text-sm">{s.name}</div>
            <div className="text-xs text-slate-400 font-mono">
              {s.latitude}, {s.longitude}
            </div>
          </div>
        </div>
      ),
    },
    { key: 'address', header: 'Endereço', render: (s: Station) => <span className="text-slate-300 text-sm">{s.address}</span> },
    {
      key: 'city',
      header: 'Cidade / Estado',
      render: (s: Station) => (
        <span className="text-white font-medium text-sm">
          {s.city} / <span className="text-emerald-400 font-bold">{s.state}</span>
        </span>
      ),
    },
    { key: 'company', header: 'Empresa', render: (s: Station) => <span className="text-slate-300 text-sm">{s.company?.name || '-'}</span> },
    { key: 'status', header: 'Status', render: (s: Station) => statusBadge(s.status) },
    {
      key: 'chargers',
      header: 'Carregadores',
      render: (s: Station) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-emerald-400 border border-slate-700">
          {s._count?.chargers || s.chargers?.length || 0} carregador(es)
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'w-24',
      render: (s: Station) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEdit(s)}
            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
            title="Editar Posto"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => handleDelete(s.id)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Remover Posto"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="text-emerald-400" size={24} /> Postos de Recarga
          </h2>
          <p className="text-sm text-slate-400 mt-1">Cadastre locais de carregamento com busca rápida de CEP e localização</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <Plus size={18} /> Novo Posto
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur relative animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Building size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {editingStation ? `Editar Posto: ${editingStation.name}` : 'Cadastrar Novo Posto de Recarga'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FOTO DO POSTO */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="relative group">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview Posto"
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
                  <Camera size={16} className="text-emerald-400" /> Foto / Imagem do Posto
                </h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Envie uma foto do local do posto de recarga (PNG, JPG ou WebP até 5MB).
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="station-photo-upload"
                />

                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                  <label
                    htmlFor="station-photo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-slate-700 hover:border-emerald-500/30 transition-all shadow-sm"
                  >
                    <Upload size={14} /> {photoPreview ? 'Alterar Foto' : 'Selecionar Foto do Posto'}
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
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-medium text-slate-300">Nome do Posto</label>
                <input
                  placeholder="Ex: Posto Eletromobilidade Centro"
                  value={form.name}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, name: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-medium text-slate-300">Empresa Proprietária</label>
                <select
                  value={form.companyId}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, companyId: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                  required
                >
                  <option value="">Selecione a empresa</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEÇÃO DE BUSCA CEP */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <Search size={16} /> Localização Automática por CEP
                </h4>
                {cepSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={13} /> Endereço Localizado!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-medium text-slate-300">Buscar CEP</label>
                  <div className="relative">
                    <input
                      placeholder="00000-000"
                      value={cep}
                      onChange={handleCepChange}
                      maxLength={9}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-mono"
                    />
                    {searchingCep && (
                      <div className="absolute right-3 top-3 text-emerald-400 animate-spin">
                        <Loader2 size={16} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300">Logradouro / Rua (Automático)</label>
                  <input
                    placeholder="Rua / Avenida preenchida pelo CEP"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-emerald-400">Número do Imóvel *</label>
                  <input
                    placeholder="Digite o número (Ex: 1500)"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-emerald-500/40 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-medium text-slate-300">Complemento</label>
                  <input
                    placeholder="Ex: Bloco B, Sala 10"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300">Bairro</label>
                  <input
                    placeholder="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* CIDADE E ESTADO DESTAQUE OBRIGATÓRIO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <MapPin size={13} className="text-emerald-400" /> Cidade (Preenchida pelo CEP)
                  </label>
                  <input
                    placeholder="Ex: São Paulo"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-emerald-300 font-semibold outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <MapPin size={13} className="text-emerald-400" /> Estado / UF (Preenchido pelo CEP)
                  </label>
                  <input
                    placeholder="Ex: SP"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-emerald-300 font-bold uppercase outline-none"
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              {/* TARIFFA */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <DollarSign size={13} className="text-emerald-400" /> Tarifa (Opcional)
                </label>
                <select
                  value={form.tariffId}
                  onChange={(e) => setForm({ ...form, tariffId: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-emerald-300 outline-none"
                >
                  <option value="">Sem tarifa vinculada</option>
                  {tariffs.filter(t => t.isActive).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — R${Number(t.pricePerKwh).toFixed(2)}/kWh
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* LATITUDE & LONGITUDE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Latitude GPS</label>
                <input
                  placeholder="-23.5505"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, latitude: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Longitude GPS</label>
                <input
                  placeholder="-46.6333"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, longitude: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono"
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
                {submitting ? 'Salvando...' : 'Salvar Posto'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
        <DataTable
          columns={columns}
          data={stations}
          searchKeys={['name', 'address', 'city']}
          searchPlaceholder="Buscar por nome, endereço ou cidade..."
          loading={loading}
          emptyMessage="Nenhum posto cadastrado"
        />
      </div>
    </div>
  );
}
