'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { MapPin, Zap, Search, Navigation, Play } from 'lucide-react';

interface Station {
  id: string; name: string; address: string; city: string; state: string;
  latitude: number; longitude: number; status: string; tariff?: { name: string; pricePerKwh: number };
  chargers?: { id: string; serialNumber: string; status: string; powerKw: number; connectors?: { id: string; type: string; status: string }[] }[]; _count?: { chargers: number };
}

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Station | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/stations');
      setStations(data.filter((s: Station) => s.status === 'ACTIVE'));
    } catch {
      setError('Nao foi possivel carregar os postos.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = stations.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-800 rounded-xl" />)}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Postos de Recarga</h2>
      {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input placeholder="Buscar por nome, endereco ou cidade..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
      </div>
      {selected && (
        <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-white font-bold text-lg">{selected.name}</h3>
              <p className="text-slate-400 text-sm">{selected.address} - {selected.city}/{selected.state}</p>
              {selected.tariff && <p className="mt-1 text-xs text-emerald-400">R$ {Number(selected.tariff.pricePerKwh).toFixed(2)}/kWh</p>}
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-lg">&times;</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Carregadores disponiveis</p>
              <p className="text-white font-bold text-lg">{selected._count?.chargers || selected.chargers?.length || 0}</p>
            </div>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`} target="_blank" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-3 flex items-center justify-center gap-2 text-sm font-medium"><Navigation size={16} /> Como chegar</a>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-white">Escolha um carregador</p>
            {(selected.chargers || []).map((charger) => (
              <div key={charger.id} className="flex items-center justify-between rounded-lg bg-slate-800 p-3">
                <div><p className="text-sm text-white">{charger.serialNumber}</p><p className="text-xs text-slate-400">{charger.powerKw} kW · {charger.status}</p></div>
                <Link href={`/portal/charging?station=${encodeURIComponent(selected.id)}&charger=${encodeURIComponent(charger.id)}`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"><Play size={13} /> Iniciar</Link>
              </div>
            ))}
          </div>
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500"><MapPin className="mx-auto mb-3" size={40} /><p>Nenhum posto encontrado</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <button key={s.id} onClick={() => setSelected(s)} className="w-full text-left bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Zap className="text-emerald-400" size={20} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{s.name}</p>
                  <p className="text-slate-400 text-sm truncate">{s.address} - {s.city}/{s.state}</p>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">{s._count?.chargers || s.chargers?.length || 0} carregador(es)</span>
                </div>
                <Navigation className="text-slate-500 flex-shrink-0" size={16} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
