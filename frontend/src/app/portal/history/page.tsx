'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { History, Clock, Zap } from 'lucide-react';

interface Session { id: string; startTime: string; endTime?: string; energyKwh: number; amount: number; status: string; station?: { name: string }; charger?: { serialNumber: string }; }

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/charging/history', { params: { page, limit: 20 } });
      const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setSessions(rows);
      setTotalPages(Number(data?.pagination?.totalPages || 1));
    } catch {
      setError('Não foi possível carregar o histórico. Tente novamente.');
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const labels: Record<string, string> = { ACTIVE: 'Em andamento', COMPLETED: 'Concluida', CANCELLED: 'Cancelada', PENDING: 'Pendente' };
  const colors: Record<string, string> = { ACTIVE: 'text-blue-400 bg-blue-500/10 border-blue-500/20', COMPLETED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', CANCELLED: 'text-red-400 bg-red-500/10 border-red-500/20', PENDING: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl" />)}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Historico de Recargas</h2>
      {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {sessions.length === 0 ? (
        <div className="text-center py-12 text-slate-500"><History className="mx-auto mb-3" size={40} /><p>Nenhuma recarga realizada</p></div>
      ) : (
         <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="text-emerald-400" size={18} />
                  <div>
                    <p className="text-white font-medium text-sm">{s.station?.name || 'Posto'} {s.charger?.serialNumber ? `- ${s.charger.serialNumber}` : ''}</p>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5"><Clock size={12} /> {new Date(s.startTime).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[s.status] || colors.PENDING}`}>{labels[s.status] || s.status}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-300"><span className="text-white font-semibold">{Number(s.energyKwh).toFixed(1)}</span> kWh</span>
                {s.amount > 0 && <span className="text-emerald-400 font-semibold">R$ {Number(s.amount).toFixed(2)}</span>}
                {s.endTime && <span className="text-slate-500 text-xs ml-auto">{new Date(s.endTime).toLocaleTimeString('pt-BR')}</span>}
              </div>
            </div>
           ))}
           {totalPages > 1 && <div className="flex items-center justify-between pt-3"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 disabled:opacity-40">Anterior</button><span className="text-xs text-slate-500">Pagina {page} de {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 disabled:opacity-40">Proxima</button></div>}
         </div>
      )}
    </div>
  );
}
