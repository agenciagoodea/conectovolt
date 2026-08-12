'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Settings, Database, CreditCard, TrendingUp, Users, Building2, Plug, Zap, Activity } from 'lucide-react';

interface SettingsData {
  stats: {
    companies: number;
    stations: number;
    chargers: number;
    users: number;
    sessions: number;
    payments: number;
  };
  financial: {
    totalRevenue: number;
    totalCommission: number;
    currentCommissionPercent: number;
  };
  gateway: {
    configured: boolean;
  };
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commissionPercent, setCommissionPercent] = useState('5');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/settings');
      setData(data);
      setCommissionPercent(String(data.financial.currentCommissionPercent));
    } catch {
      setError('Nao foi possivel carregar as configuracoes.');
    }
    setLoading(false);
  }, []);

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(commissionPercent);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setError('A comissao deve estar entre 0 e 100%.');
      return;
    }
    setSaving(true);
    setError('');
    setSaved('');
    try {
      const { data: updated } = await api.patch('/settings', { commissionPercent: value });
      setData(updated);
      setCommissionPercent(String(updated.financial.currentCommissionPercent));
      setSaved('Configuracoes salvas.');
    } catch {
      setError('Nao foi possivel salvar as configuracoes.');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !data) {
    return (
      <div>
        {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
        <div className="h-8 w-48 bg-slate-800 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-6 animate-pulse">
              <div className="h-5 w-32 bg-slate-800 rounded mb-4" />
              <div className="h-8 w-24 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Settings size={24} className="text-emerald-400" /> Configuracoes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Users size={20} />} label="Usuários" value={data.stats.users} color="purple" />
        <StatCard icon={<Building2 size={20} />} label="Empresas" value={data.stats.companies} color="blue" />
        <StatCard icon={<Zap size={20} />} label="Postos" value={data.stats.stations} color="yellow" />
        <StatCard icon={<Plug size={20} />} label="Carregadores" value={data.stats.chargers} color="red" />
        <StatCard icon={<Activity size={20} />} label="Sessões" value={data.stats.sessions} color="indigo" />
        <StatCard icon={<CreditCard size={20} />} label="Pagamentos" value={data.stats.payments} color="emerald" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" /> Financeiro
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Receita Total</span>
              <span className="text-white font-bold">R$ {Number(data.financial.totalRevenue).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Comissao Total</span>
              <span className="text-emerald-400 font-bold">R$ {Number(data.financial.totalCommission).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-slate-400 text-sm">Comissao Padrao</span>
              <span className="text-white font-bold">{data.financial.currentCommissionPercent}%</span>
            </div>
            <form onSubmit={saveSettings} className="flex items-end gap-2 pt-2">
              <label className="flex-1 text-xs text-slate-400">Atualizar percentual
                <input type="number" min="0" max="100" step="0.01" value={commissionPercent} onChange={(event) => setCommissionPercent(event.target.value)} className="input-field mt-1" />
              </label>
              <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50">{saving ? 'Salvando...' : 'Salvar'}</button>
            </form>
            {saved && <p className="text-xs text-emerald-400">{saved}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-400" /> Gateway Pagamento
            </h3>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${data.gateway.configured ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-slate-300 text-sm">
                Mercado Pago: {data.gateway.configured ? 'Configurado (Modo Producao)' : 'Modo Simulacao'}
              </span>
            </div>
            {!data.gateway.configured && (
              <p className="text-xs text-slate-500 mt-3">
                Configure a variavel MERCADO_PAGO_ACCESS_TOKEN no .env para ativar pagamentos reais.
              </p>
            )}
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Database size={18} className="text-yellow-400" /> Informacao do Sistema
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Versao</span>
                <span className="text-white">MVP 1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">API</span>
                <span className="text-white">/api/v1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gateway Carregadores</span>
                <span className="text-white">OCPP 1.6J</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[color] || colors.emerald}`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
