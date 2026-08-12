'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Camera, Upload, User as UserIcon, X, Shield, Phone, Mail, Building2, Search, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import DataTable from '@/components/data-table';

interface Company {
  id: string;
  name: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatarUrl?: string | null;
  companyId?: string;
  company?: Company;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  OPERATOR: 'Operador',
  CUSTOMER: 'Cliente',
};

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
    companyId: '',
    avatarUrl: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
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

  useEffect(() => {
    void load();
    void loadCompanies();
  }, [load, loadCompanies]);

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
      setAvatarPreview(result);
      setForm((prev) => ({ ...prev, avatarUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setAvatarPreview(null);
    setForm((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // CEP & Endereco
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [searchingCep, setSearchingCep] = useState(false);
  const [cepSuccess, setCepSuccess] = useState(false);

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
    setEditingUser(null);
    const defaultCompany = companies[0]?.id || '';
    setForm({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER', companyId: defaultCompany, avatarUrl: '' });
    setCep('');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('');
    setState('');
    setCepSuccess(false);
    setAvatarPreview(null);
    setError('');
    setShowForm(true);
  }, [companies]);

  const openEdit = useCallback((u: UserItem) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      phone: u.phone || '',
      role: u.role,
      companyId: u.companyId || '',
      avatarUrl: u.avatarUrl || '',
    });
    setAvatarPreview(u.avatarUrl || null);
    setError('');
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      try {
        if (editingUser) {
          await api.patch(`/users/${editingUser.id}`, {
            name: form.name,
            phone: form.phone,
            role: form.role,
            companyId: form.companyId || undefined,
            avatarUrl: form.avatarUrl || undefined,
          });
        } else {
          await api.post('/users', form);
        }
        setShowForm(false);
        void load();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar usuario';
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [form, editingUser, load]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Tem certeza que deseja remover este usuario?')) return;
      setError('');
      try {
        await api.delete(`/users/${id}`);
        void load();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao remover usuario');
      }
    },
    [load]
  );

  const renderAvatar = (u: UserItem) => {
    if (u.avatarUrl) {
      return (
        <img
          src={u.avatarUrl}
          alt={u.name}
          className="w-9 h-9 rounded-full object-cover border border-emerald-500/30 shadow-sm"
        />
      );
    }
    const initials = u.name
      ? u.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U';

    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-semibold flex items-center justify-center text-xs shadow-sm border border-emerald-500/20">
        {initials}
      </div>
    );
  };

  const columns = [
    {
      key: 'name',
      header: 'Usuario',
      render: (u: UserItem) => (
        <div className="flex items-center gap-3">
          {renderAvatar(u)}
          <div>
            <div className="text-white font-medium text-sm leading-tight">{u.name}</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Perfil',
      render: (u: UserItem) => {
        const styles: Record<string, string> = {
          SUPER_ADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-purple-900/10',
          OPERATOR: 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-blue-900/10',
          CUSTOMER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-900/10',
        };
        return (
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles[u.role] || styles.CUSTOMER}`}>
            {ROLE_LABELS[u.role] || u.role}
          </span>
        );
      },
    },
    {
      key: 'company',
      header: 'Empresa',
      render: (u: UserItem) => <span className="text-slate-300 text-sm">{u.company?.name || '-'}</span>,
    },
    {
      key: 'phone',
      header: 'Telefone',
      render: (u: UserItem) => <span className="text-slate-300 text-sm font-mono">{u.phone || '-'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Cadastro',
      render: (u: UserItem) => (
        <span className="text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Acoes',
      className: 'w-24',
      render: (u: UserItem) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEdit(u)}
            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
            title="Editar Usuario"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => handleDelete(u.id)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Remover Usuario"
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
            <UserIcon className="text-emerald-400" size={24} /> Gestao de Usuarios
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gerencie perfis, permissoes e avatares de acesso ao sistema</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <Plus size={18} /> Novo Usuario
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur relative animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <UserIcon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? `Editar Usuario: ${editingUser.name}` : 'Cadastrar Novo Usuario'}
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
              <span className="font-semibold">Erro:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto de perfil */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400">
                    <Camera size={28} className="mb-1 text-slate-500" />
                    <span className="text-[10px]">Sem Foto</span>
                  </div>
                )}
                {avatarPreview && (
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
                  <Camera size={16} className="text-emerald-400" /> Foto de Perfil
                </h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Envie uma imagem do seu computador (PNG, JPG ou WebP ate 5MB). Ela sera armazenada no perfil sem necessitar de URL externa.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="avatar-upload-input"
                />

                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                  <label
                    htmlFor="avatar-upload-input"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-slate-700 hover:border-emerald-500/30 transition-all shadow-sm"
                  >
                    <Upload size={14} /> {avatarPreview ? 'Alterar Imagem' : 'Selecionar Arquivo de Foto'}
                  </label>
                  {avatarPreview && (
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

            {/* Inputs em Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <UserIcon size={14} className="text-emerald-400" /> Nome Completo
                </label>
                <input
                  placeholder="Ex: Joao da Silva"
                  value={form.name}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, name: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail size={14} className="text-emerald-400" /> E-mail
                </label>
                <input
                  placeholder="exemplo@conectovolt.com.br"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, email: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                  required
                  disabled={!!editingUser}
                />
              </div>

              {!editingUser && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Shield size={14} className="text-emerald-400" /> Senha de Acesso
                  </label>
                  <input
                    placeholder="Minimo 6 caracteres"
                    type="password"
                    value={form.password}
                    onChange={(e) => {
                      setError('');
                      setForm({ ...form, password: e.target.value });
                    }}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-400" /> Telefone / Celular
                </label>
                <input
                  placeholder="(92) 99999-9999"
                  value={form.phone}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, phone: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Shield size={14} className="text-emerald-400" /> Perfil de Permissao
                </label>
                <select
                  value={form.role}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, role: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                  required
                >
                  <option value="CUSTOMER">Cliente</option>
                  <option value="OPERATOR">Operador de Posto</option>
                  {user?.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">Super Administrador</option>}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Building2 size={14} className="text-emerald-400" /> Empresa Associada
                </label>
                <select
                  value={form.companyId}
                  onChange={(e) => {
                    setError('');
                    setForm({ ...form, companyId: e.target.value });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                >
                  <option value="">Empresa Principal do Sistema (Auto)</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECAO DE BUSCA CEP & ENDERECO EM CAMPOS SEPARADOS */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                  <Search size={16} /> Endereço Residencial (Busca por CEP)
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
                    placeholder="Somente o número (Ex: 100)"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-emerald-500/40 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-medium text-slate-300">Complemento</label>
                  <input
                    placeholder="Apto 101, Bloco A"
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
                {submitting ? 'Salvando...' : 'Salvar Usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
        <DataTable
          columns={columns}
          data={users}
          searchKeys={['name', 'email']}
          searchPlaceholder="Buscar por nome ou e-mail..."
          loading={loading}
          emptyMessage="Nenhum usuario cadastrado"
        />
      </div>
    </div>
  );
}
