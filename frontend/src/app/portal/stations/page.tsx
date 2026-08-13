'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useChargingSocket } from '@/lib/use-charging-socket';
import { MapPin, Zap, Navigation, ChevronRight, Search } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  tariff?: { name: string; pricePerKwh: number };
  chargers?: { id: string; status: string; powerKw: number; model?: string }[];
}

function unwrap<T>(value: T | { data: T }): T {
  if (value && typeof value === 'object' && 'data' in value) {
    return value.data;
  }
  return value as T;
}

export default function StationsPage() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('vehicle') || '';
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Station | null>(null);

  const socket = useChargingSocket();

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/stations');
      const list = unwrap<Station[]>(data);
      setStations(list.filter((s) => s.status === 'ACTIVE'));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    socket.onChargerStatus((data) => {
      setStations((prev) =>
        prev.map((station) => ({
          ...station,
          chargers: station.chargers?.map((c) =>
            c.id === data.chargerId ? { ...c, status: data.status } : c
          ),
        }))
      );
      setSelected((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          chargers: prev.chargers?.map((c) =>
            c.id === data.chargerId ? { ...c, status: data.status } : c
          ),
        };
      });
    });
  }, [socket.onChargerStatus]);

  const filtered = stations.filter(
    (s) => !filter || s.name.toLowerCase().includes(filter.toLowerCase()) || s.address.toLowerCase().includes(filter.toLowerCase()) || (s.city || '').toLowerCase().includes(filter.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: '#111' }} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">Postos de Recarga</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input
          placeholder="Buscar por nome, endereco..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none"
          style={{ background: '#111', border: '1px solid #1f1f1f' }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="mx-auto mb-3 text-slate-700" size={40} />
          <p className="text-slate-500 text-sm">Nenhum posto encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((station) => {
            const onlineCount = station.chargers?.filter((c) => c.status === 'ONLINE').length || 0;
            const totalCount = station.chargers?.length || 0;
            return (
              <button
                key={station.id}
                onClick={() => setSelected(selected?.id === station.id ? null : station)}
                className="w-full text-left rounded-2xl p-4 active:scale-[0.98] transition-transform"
                style={{ background: '#111', border: `1px solid ${selected?.id === station.id ? '#10b98133' : '#1f1f1f'}` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base">{station.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{station.address}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={`h-2 w-2 rounded-full ${onlineCount > 0 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className="text-xs text-slate-400">{onlineCount}/{totalCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {station.tariff && (
                    <span className="flex items-center gap-1"><Zap size={10} className="text-emerald-400" /> R$ {Number(station.tariff.pricePerKwh).toFixed(2)}/kWh</span>
                  )}
                  {station.city && <span>{station.city}</span>}
                </div>

                {selected?.id === station.id && (
                  <div className="mt-3 pt-3 space-y-3" style={{ borderTop: '1px solid #1f1f1f' }}>
                    {station.chargers?.map((charger) => (
                      <div key={charger.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${charger.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          <span className="text-white text-sm">{charger.model || charger.id.slice(-6)}</span>
                          <span className="text-slate-500 text-xs">{charger.powerKw}kW</span>
                        </div>
                        {charger.status === 'ONLINE' ? (
                          <Link
                            href={`/portal/charging?station=${station.id}&charger=${charger.id}${vehicleId ? `&vehicle=${vehicleId}` : ''}`}
                            className="flex items-center gap-1 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{ background: '#10b98115' }}
                          >
                            Recargar <ChevronRight size={14} />
                          </Link>
                        ) : (
                          <span className="text-slate-600 text-xs px-3 py-1.5">Offline</span>
                        )}
                      </div>
                    ))}
                    {station.latitude && station.longitude && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full text-blue-400 text-xs py-2 rounded-lg"
                        style={{ background: '#1e40af15' }}
                      >
                        <Navigation size={14} /> Como chegar
                      </a>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
