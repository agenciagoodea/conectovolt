'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Camera, Upload, Building, X, Search, CheckCircle2, Loader2, Check, XCircle } from 'lucide-react';
import DataTable from '@/components/data-table';

interface Company {
  id: string;
  name: string;
  document: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  status: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  _count?: { stations: number; users: number };
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [form, setForm] = useState({ name: '', document: '', email: '', phone: '', logoUrl: '' });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CEP & Endereço em campos separados
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [searchingCep, setSearchingCep] = useState(false);
  const [cepSuccess, setCepSuccess] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/companies');
      setCompanies(data);
    } catch {
      setError('Erro ao carregar empresas');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
      setLogoPreview(result);
      setForm((prev) => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setLogoPreview(null);
    setForm((prev) => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fetchCep = useCallback(async (cleanCep: string) => {
    if (cleanCep.length !== 8) return;
    setSearchingCep(true);
    setError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setError('CEP nao encontrado. Verifique o numero digitado.');
        setCepSuccess(false);
      } else {
        setStreet(data.logradouro || '');
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        setState(data.uf || '');
        setCepSuccess(true);
      }
    } catch {
      setError('Erro ao buscar CEP na API ViaCEP.');
      setCepSuccess(false);
    } finally {
      setSearchingCep(false);
    }
  }, []);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    const formatted = val.length > 5 ? `${val.slice(0, 5)}-${val.slice(5)}` : val;
    setCep(formatted);
    if (val.length === 8) {
      void fetchCep(val);
    } else {
      setCepSuccess(false);
    }
  };

  const openCreate = useCallback(() => {
    setEditingCompany(null);
    setForm({ name: '', document: '', email: '', phone: '', logoUrl: '' });
    setLogoPreview(null);
    setCep('');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('');
    setState('');
    setCepSuccess(false);
    setShowForm(true);
    setError('');
  }, []);

  const openEdit = useCallback((c: Company) => {
    setEditingCompany(c);
    setForm({ name: c.name, document: c.document, email: c.email || '', phone: c.phone || '', logoUrl: c.logoUrl || '' });
    setLogoPreview(c.logoUrl || null);
    setCep(c.cep || '');
    setStreet(c.street || '');
    setNumber(c.number || '');
    setComplement(c.complement || '');
    setNeighborhood(c.neighborhood || '');
    setCity(c.city || '');
    setState(c.state || '');
    setCepSuccess(!!c.cep);
    setShowForm(true);
    setError('');
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      try {
        const addressPayload = {
          cep: cep || undefined,
          street: street || undefined,
          number: number || undefined,
          complement: complement || undefined,
          neighborhood: neighborhood || undefined,
          city: city || undefined,
          state: state || undefined,
        };
        if (editingCompany) {
          await api.patch(`/companies/${editingCompany.id}`, {
            name: form.name,
            email: form.email,
            phone: form.phone,
            ...addressPayload,
          });
        } else {
          const { logoUrl: _, ...basePayload } = form;
          await api.post('/companies', { ...basePayload, ...addressPayload });
        }
        setShowForm(false);
        void load();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar empresa';
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [editingCompany, form, cep, street, number, complement, neighborhood, city, state, load]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Tem certeza que deseja remover esta empresa? Todos os dados relacionados serao excluidos.')) return;
      try {
        await api.delete(`/companies/${id}`);
        void load();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao remover empresa';
        setError(msg);
      }
    },
    [load]
  );

  const handleApprove = useCallback(
    async (id: string) => {
      try {
        await api.post(`/companies/${id}/approve`);
        void load();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao aprovar empresa';
        setError(msg);
      }
    },
    [load]
  );

  const handleReject = useCallback(
    async (id: string) => {
      try {
        await api.post(`/companies/${id}/reject`);
        void load();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao rejeitar empresa';
        setError(msg);
      }
    },
    [load]
  );

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      INACTIVE: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    const labels: Record<string, string> = { ACTIVE: 'Ativa', PENDING: 'Pendente', INACTIVE: 'Inativa' };
    return <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles[status]}`}>{labels[status] || status}</span>;
  };

  const columns = [
    {
      key: 'name',
      header: 'Empresa / Operadora',
      render: (c: Company) => (
        <div className="flex items-center gap-3">
          {c.logoUrl ? (
            <img src={c.logoUrl} alt={c.name} className="w-9 h-9 rounded-xl object-cover border border-emerald-500/30" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs">
              {c.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-white font-medium text-sm leading-tight">{c.name}</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">{c.document}</div>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (c: Company) => <span className="text-slate-300 text-sm">{c.email || '-'}</span> },
    { key: 'phone', header: 'Telefone', render: (c: Company) => <span className="text-slate-300 text-sm font-mono">{c.phone || '-'}</span> },
    { key: 'status', header: 'Status', render: (c: Company) => statusBadge(c.status) },
    { key: 'stations', header: 'Postos', render: (c: Company) => <span className="text-slate-300 text-sm">{c._count?.stations || 0}</span> },
    {
      key: 'actions',
      header: 'Acoes',
      className: 'w-32',
      render: (c: Company) => (
        <div className="flex items-center gap-1.5">
          {c.status === 'PENDING' && (
            <>
              <button onClick={() => handleApprove(c.id)} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Aprovar">
                <Check size={14} />
              </button>
              <button onClick={() => handleReject(c.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Rejeitar">
                <XCircle size={14} />
              </button>
            </>
          )}
          <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Editar"><Pencil size={14} /></button>
          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Remover"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building className="text-emerald-400" size={24} /> Empresas & Operadoras
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gerencie operadoras de postos de recarga, CNPJ, logotipo e endereco de sede</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <Plus size={18} /> Nova Empresa
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur relative animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Building size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {editingCompany ? `Editar Empresa: ${editingCompany.name}` : 'Cadastrar Nova Empresa / Operadora'}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LOGOTIPO / FOTO DE PERFIL DA EMPRESA */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="relative group">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Preview Logo"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400">
                    <Camera size={28} className="mb-1 text-slate-500" />
                    <span className="text-[10px]">Sem Logo</span>
                  </div>
                )}
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-colors"
                    title="Remover foto"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <h4 className="text-sm font-medium text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <Camera size={16} className="text-emerald-400" /> Logotipo / Foto da Empresa
                </h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Envie a imagem da logomarca da operadora (PNG, JPG ou WebP ate 5MB).
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="logo-upload-input"
                />

                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                  <label
                    htmlFor="logo-upload-input"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-slate-700 hover:border-emerald-500/30 transition-all shadow-sm"
                  >
                    <Upload size={14} /> {logoPreview ? 'Alterar Logotipo' : 'Selecionar Arquivo de Foto'}
                  </label>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={removePhoto}
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
                <label className="text-xs font-medium text-slate-300">Razao Social / Nome Fantasia</label>
                <input
                  placeholder="Ex: EletroPosto Brasil Ltda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">CNPJ / Documento</label>
                <input
                  placeholder="00.000.000/0000-00"
                  value={form.document}
                  onChange={(e) => setForm({ ...form, document: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                  required
                  disabled={!!editingCompany}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">E-mail Corporativo</label>
                <input
                  placeholder="contato@empresa.com.br"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Telefone de Contato</label>
                <input
                  placeholder="(11) 99999-9999"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* SECAO DE BUSCA CEP & ENDERECO DA SEDE DA EMPRESA EM CAMPOS SEPARADOS */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <Search size={16} /> Endereço da Sede (Busca por CEP)
                </h4>
                {cepSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={13} /> CEP Localizado!
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-emerald-400">Número do Imóvel *</label>
                  <input
                    placeholder="Digite o número"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-emerald-500/40 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-medium text-slate-300">Complemento / Sala</label>
                  <input
                    placeholder="Ex: Sala 402"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Cidade (Automático)</label>
                  <input
                    placeholder="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Estado (UF)</label>
                  <input
                    placeholder="UF (Ex: SP, RJ, AM)"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    maxLength={2}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none uppercase font-mono"
                  />
                </div>
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
                {submitting ? 'Salvando...' : 'Salvar Empresa'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
        <DataTable
          columns={columns}
          data={companies}
          searchKeys={['name', 'document', 'email']}
          searchPlaceholder="Buscar por nome, CNPJ ou e-mail..."
          loading={loading}
          emptyMessage="Nenhuma empresa cadastrada"
        />
      </div>
    </div>
  );
}
