'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useChargingSocket } from '@/lib/use-charging-socket';
import { Clock, Zap, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  startTime: string;
  endTime?: string;
  energyKwh: number;
  amount: number;
  status: string;
  station?: { name: string; address: string };
  charger?: { serialNumber: string };
}

function unwrap<T>(value: T | { data: T }): T {
  if (value && typeof value === 'object' && 'data' in value) {
    return value.data;
  }
  return value as T;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Em andamento', color: '#10b981' },
  COMPLETED: { label: 'Concluida', color: '#3b82f6' },
  CANCELLED: { label: 'Cancelada', color: '#6b7280' },
  PENDING: { label: 'Pendente', color: '#f59e0b' },
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const socket = useChargingSocket();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/charging/history?page=${page}&limit=10`);
      const result = unwrap<{ data: HistoryItem[]; pagination: { totalPages: number } }>(data);
      setItems(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    socket.onSessionCompleted((data) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.sessionId
            ? { ...item, status: 'COMPLETED', energyKwh: data.energyKwh, amount: data.amount || item.amount, endTime: String(data.endTime || '') }
            : item
        )
      );
    });

    socket.onSessionUpdate((data) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.sessionId && item.status === 'ACTIVE'
            ? { ...item, energyKwh: data.energyKwh, amount: data.amount || item.amount }
            : item
        )
      );
    });
  }, [socket.onSessionCompleted, socket.onSessionUpdate]);

  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: '#111' }} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">Historico</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="mx-auto mb-3 text-slate-700" size={48} />
          <p className="text-slate-500 font-medium">Nenhuma recarga registrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const status = STATUS_MAP[item.status] || STATUS_MAP.PENDING;
            const durationMin = item.endTime
              ? Math.round((new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / 60000)
              : null;
            return (
              <div key={item.id} className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{item.station?.name || 'Posto'}</p>
                    <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> {item.station?.address || '-'}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-2" style={{ background: `${status.color}20`, color: status.color }}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Zap size={10} className="text-emerald-400" /> {Number(item.energyKwh).toFixed(2)} kWh</span>
                  <span className="text-white font-bold">R$ {Number(item.amount).toFixed(2)}</span>
                  {durationMin !== null && <span>{durationMin} min</span>}
                  <span className="ml-auto">{new Date(item.startTime).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 text-sm text-slate-400 disabled:text-slate-700"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="text-xs text-slate-500">{page}/{totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 text-sm text-slate-400 disabled:text-slate-700"
          >
            Proximo <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
