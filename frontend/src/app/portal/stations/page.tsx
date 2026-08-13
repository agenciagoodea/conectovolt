'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useChargingSocket } from '@/lib/use-charging-socket';
import { MapPin, Zap, Navigation, ChevronRight, Search, Battery, Plug, Wifi, WifiOff } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  tariff?: { name: string; pricePerKwh: number };
  chargers?: {
    id: string;
    status: string;
    powerKw: number;
    model?: string;
    ocppId?: string;
    connectors?: { id: string; status: string; type: string }[];
  }[];
}

function unwrap<T>(value: T | { data: T }): T {
  if (value && typeof value === 'object' && 'data' in value) {
    return value.data;
  }
  return value as T;
}

const CHARGER_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  ONLINE: { label: 'Online', color: '#10b981', bg: '#10b98115' },
  OFFLINE: { label: 'Offline', color: '#6b7280', bg: '#6b728015' },
  CHARGING: { label: 'Em uso', color: '#f59e0b', bg: '#f59e0b15' },
  FAULTED: { label: 'Com defeito', color: '#ef4444', bg: '#ef444415' },
  UNKNOWN: { label: 'Desconhecido', color: '#6b7280', bg: '#6b728015' },
};

const CONNECTOR_STATUS: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: 'Livre', color: '#10b981' },
  OCCUPIED: { label: 'Ocupado', color: '#f59e0b' },
  CHARGING: { label: 'Carregando', color: '#3b82f6' },
  FAULTED: { label: 'Defeito', color: '#ef4444' },
  UNKNOWN: { label: 'Desconhecido', color: '#6b7280' },
};

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

    socket.onConnectorStatus((data) => {
      const updateConnectors = (station: Station) => ({
        ...station,
        chargers: station.chargers?.map((c) => {
          if (c.id !== data.chargerId) return c;
          return {
            ...c,
            connectors: c.connectors?.map((conn) =>
              conn.id === data.connectorId ? { ...conn, status: data.status } : conn
            ),
          };
        }),
      });
      setStations((prev) => prev.map(updateConnectors));
      setSelected((prev) => (prev ? updateConnectors(prev) : null));
    });
  }, [socket.onChargerStatus, socket.onConnectorStatus]);

  const filtered = stations.filter(
    (s) => !filter || s.name.toLowerCase().includes(filter.toLowerCase()) || s.address.toLowerCase().includes(filter.toLowerCase()) || (s.city || '').toLowerCase().includes(filter.toLowerCase()),
  );

  function getStationStats(station: Station) {
    const chargers = station.chargers || [];
    const total = chargers.length;
    const online = chargers.filter((c) => c.status === 'ONLINE' || c.status === 'CHARGING').length;
    const available = chargers.filter((c) => {
      if (c.status !== 'ONLINE') return false;
      return c.connectors?.some((conn) => conn.status === 'AVAILABLE') ?? true;
    }).length;
    return { total, online, available };
  }

  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: '#111' }} />)}
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
            const stats = getStationStats(station);
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
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: stats.online > 0 ? '#10b98115' : '#6b728015' }}>
                      <span className={`h-2 w-2 rounded-full ${stats.online > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="text-xs font-medium" style={{ color: stats.online > 0 ? '#10b981' : '#6b7280' }}>
                        {stats.online}/{stats.total}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {station.tariff && (
                    <span className="flex items-center gap-1"><Zap size={10} className="text-emerald-400" /> R$ {Number(station.tariff.pricePerKwh).toFixed(2)}/kWh</span>
                  )}
                  {station.city && <span>{station.city}</span>}
                  {stats.available > 0 && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Battery size={10} /> {stats.available} livre{stats.available > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {selected?.id === station.id && (
                  <div className="mt-3 pt-3 space-y-3" style={{ borderTop: '1px solid #1f1f1f' }}>
                    {station.chargers?.map((charger) => {
                      const statusInfo = CHARGER_STATUS[charger.status] || CHARGER_STATUS.UNKNOWN;
                      return (
                        <div key={charger.id} className="rounded-xl p-3" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: statusInfo.bg }}>
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusInfo.color }} />
                                <span className="text-[10px] font-medium" style={{ color: statusInfo.color }}>{statusInfo.label}</span>
                              </div>
                              <span className="text-white text-sm font-medium">{charger.model || `Carregador ${charger.id.slice(-4)}`}</span>
                            </div>
                            <span className="text-slate-500 text-xs">{charger.powerKw}kW</span>
                          </div>

                          {charger.connectors && charger.connectors.length > 0 && (
                            <div className="flex gap-2 mb-2 flex-wrap">
                              {charger.connectors.map((conn) => {
                                const connStatus = CONNECTOR_STATUS[conn.status] || CONNECTOR_STATUS.UNKNOWN;
                                const isAvailable = conn.status === 'AVAILABLE';
                                return (
                                  <button
                                    key={conn.id}
                                    disabled={!isAvailable}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97]"
                                    style={{
                                      background: `${connStatus.color}10`,
                                      border: `1.5px solid ${isAvailable ? connStatus.color + '44' : connStatus.color + '22'}`,
                                      color: connStatus.color,
                                      opacity: isAvailable ? 1 : 0.7,
                                    }}
                                  >
                                    <Plug size={12} />
                                    <span>{conn.type}</span>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: connStatus.color }} />
                                    <span className="text-[10px]">{connStatus.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {charger.status === 'ONLINE' ? (
                              <Link
                                href={`/portal/charging?station=${station.id}&charger=${charger.id}${vehicleId ? `&vehicle=${vehicleId}` : ''}`}
                                className="flex-1 flex items-center justify-center gap-1 text-emerald-400 text-xs font-medium py-2 rounded-lg"
                                style={{ background: '#10b98115' }}
                              >
                                Recargar <ChevronRight size={14} />
                              </Link>
                            ) : (
                              <span className="flex-1 text-center text-slate-600 text-xs py-2">Indisponivel</span>
                            )}
                            {station.latitude && station.longitude && (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1 text-blue-400 text-xs py-2 px-3 rounded-lg"
                                style={{ background: '#1e40af15' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Navigation size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
