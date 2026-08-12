'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Wallet, ArrowUpRight, History } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description?: string;
  createdAt: string;
}

export default function FinancialPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user?.companyId) return;
    try {
      const { data: walletData } = await api.get(`/wallet`);
      setBalance(Number(walletData.balance || 0));
    } catch {
      setError('Nao foi possivel carregar o saldo.');
    }
    try {
      const { data: txData } = await api.get(`/wallet/transactions`);
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch {
      setError((current) => current || 'Nao foi possivel carregar o extrato.');
    }
  }, [user?.companyId]);

  useEffect(() => { void load(); }, [load]);

  const handleWithdraw = useCallback(async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return;
    if (!confirm(`Confirma o saque de R$ ${amount.toFixed(2)}?`)) return;
    setWithdrawing(true);
    setError('');
    try {
      await api.post('/wallet/withdraw', { amount });
      setWithdrawAmount('');
      void load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao realizar saque';
      setError(msg);
    } finally {
      setWithdrawing(false);
    }
  }, [withdrawAmount, load]);

  const typeLabel: Record<string, string> = {
    CREDIT: 'Crédito', DEBIT: 'Débito', WITHDRAWAL: 'Saque', COMMISSION: 'Comissão',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Financeiro</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Saldo Disponível</p>
              <p className="text-3xl font-bold text-white">R$ {balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Valor do saque"
              value={withdrawAmount}
              onChange={(e) => { setWithdrawAmount(e.target.value); setError(''); }}
              className="input-field flex-1"
              disabled={withdrawing}
            />
            <button
              onClick={handleWithdraw}
              disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {withdrawing ? 'Processando...' : 'Sacar'}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-emerald-400" />
            Últimos Créditos
          </h3>
          {transactions.filter((t) => t.type === 'CREDIT').slice(0, 5).map((t) => (
            <div key={t.id} className="flex justify-between py-2 border-b border-slate-800/50 text-sm">
              <span className="text-slate-300">{t.description || 'Crédito'}</span>
              <span className="text-emerald-400">+ R$ {Number(t.amount).toFixed(2)}</span>
            </div>
          ))}
          {transactions.filter((t) => t.type === 'CREDIT').length === 0 && (
            <p className="text-sm text-slate-500">Nenhum crédito registrado</p>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-white font-medium flex items-center gap-2">
            <History size={18} /> Extrato Completo
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="p-4 text-sm text-slate-400 font-medium">Tipo</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Descricao</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Valor</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="p-4 text-sm">
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      t.type === 'CREDIT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      t.type === 'WITHDRAWAL' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {typeLabel[t.type] || t.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">{t.description || '-'}</td>
                  <td className={`p-4 text-sm font-medium ${t.type === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'CREDIT' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                  </td>
                  <td className="p-4 text-sm text-slate-400">{new Date(t.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhuma transacao registrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
