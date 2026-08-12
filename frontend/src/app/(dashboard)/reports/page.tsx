'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

interface Commission {
  id: string;
  percentage: number;
  platformAmount: number;
  operatorAmount: number;
  createdAt: string;
  company?: { id: string; name: string };
  payment?: { amount: number; status: string };
}

export default function ReportsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { data } = await api.get('/commissions');
      setCommissions(data);
    } catch {
      setError('Erro ao carregar comissões. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totalCommission = commissions.reduce((sum, c) => sum + Number(c.platformAmount), 0);
  const totalOperator = commissions.reduce((sum, c) => sum + Number(c.operatorAmount), 0);
  const totalGross = commissions.reduce((sum, c) => sum + Number(c.payment?.amount || 0), 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Relatórios</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400">
          {error}
          <button onClick={() => void load()} className="ml-3 underline hover:text-red-300">Tentar novamente</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-emerald-400" size={20} />
            <span className="text-sm text-slate-400">Receita Bruta</span>
          </div>
          <p className="text-2xl font-bold text-white">R$ {totalGross.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-400" size={20} />
            <span className="text-sm text-slate-400">Comissão Plataforma</span>
          </div>
          <p className="text-2xl font-bold text-white">R$ {totalCommission.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-purple-400" size={20} />
            <span className="text-sm text-slate-400">Repasse Operadores</span>
          </div>
          <p className="text-2xl font-bold text-white">R$ {totalOperator.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-white font-medium">Histórico de Comissões</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="p-4 text-sm text-slate-400 font-medium">Operador</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Valor Total</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Comissão (5%)</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Repasse</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="p-4 text-white text-sm">{c.company?.name || '-'}</td>
                  <td className="p-4 text-slate-300 text-sm">R$ {Number(c.payment?.amount || 0).toFixed(2)}</td>
                  <td className="p-4 text-emerald-400 text-sm">R$ {Number(c.platformAmount).toFixed(2)}</td>
                  <td className="p-4 text-blue-400 text-sm">R$ {Number(c.operatorAmount).toFixed(2)}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
              {commissions.length === 0 && !loading && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhuma comissão registrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
