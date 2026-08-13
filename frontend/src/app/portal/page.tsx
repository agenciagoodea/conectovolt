'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { Zap, Car, MapPin, History, Plus, Battery, ArrowRight, CircleStop, Clock } from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  batteryCapacity?: number;
}

interface ActiveSession {
  id: string;
  status: string;
  energyKwh: number;
  amount: number;
  startTime: string;
  station?: { name: string; address: string };
  charger?: { serialNumber: string };
  tariff?: { name: string; pricePerKwh: number };
}

function unwrap<T>(value: T | { data: T }): T {
  if (value && typeof value === 'object' && 'data' in value) {
    return value.data;
  }
  return value as T;
}

export default function PortalHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [vehicleRes, sessionRes] = await Promise.all([
        api.get('/vehicles').catch(() => ({ data: [] })),
        api.get('/charging/active').catch(() => ({ data: null })),
      ]);
      setVehicles(unwrap<Vehicle[]>(vehicleRes.data));
      setActiveSession(unwrap<ActiveSession | null>(sessionRes.data));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'ACTIVE') return;
    const timer = window.setInterval(async () => {
      try {
        const { data } = await api.get(`/charging/${activeSession.id}`);
        setActiveSession(unwrap<ActiveSession>(data));
      } catch { /* silent */ }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [activeSession]);

  const pricePerKwh = Number(activeSession?.tariff?.pricePerKwh || 0);
  const currentAmount = Number(activeSession?.amount || 0) || Number(activeSession?.energyKwh || 0) * pricePerKwh;
  const durationMin = activeSession
    ? Math.round((Date.now() - new Date(activeSession.startTime).getTime()) / 60000)
    : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => <div key={i} className="h-32 bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Ola, {user?.name?.split(' ')[0] || 'Motorista'}</h1>
        <p className="text-slate-400 text-sm mt-0.5">Pronto para recarregar?</p>
      </div>

      {activeSession && activeSession.status === 'ACTIVE' && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">Recarga em andamento</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{Number(activeSession.energyKwh || 0).toFixed(1)}</p>
              <p className="text-xs text-slate-400">kWh</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-400">R$ {currentAmount.toFixed(2)}</p>
              <p className="text-xs text-slate-400">parcial</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{durationMin}</p>
              <p className="text-xs text-slate-400">min</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <MapPin size={12} />
            <span>{activeSession.station?.name || 'Posto'}</span>
            <span>·</span>
            <span>{activeSession.charger?.serialNumber || ''}</span>
          </div>
          <button
            onClick={() => router.push(`/portal/charging?station=${activeSession.station?.name || ''}&charger=`)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            <CircleStop size={16} /> Finalizar recarga
          </button>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-slate-300">Meus Veiculos</h2>
          <Link href="/portal/vehicles" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <Plus size={12} /> cadastrar
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <Link href="/portal/vehicles" className="block rounded-xl border border-dashed border-slate-700 p-6 text-center hover:border-emerald-500/30 transition-colors">
            <Car className="mx-auto mb-2 text-slate-600" size={32} />
            <p className="text-sm text-slate-400">Nenhum veiculo cadastrado</p>
            <p className="text-xs text-slate-500 mt-1">Clique para cadastrar</p>
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {vehicles.map((v) => (
              <Link
                key={v.id}
                href={`/portal/stations?vehicle=${v.id}`}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/30 transition-colors group text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Car className="text-blue-400" size={16} />
                  </div>
                  {v.batteryCapacity && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Battery size={12} /> {v.batteryCapacity} kWh
                    </div>
                  )}
                </div>
                <p className="text-white font-medium text-sm">{v.brand} {v.model}</p>
                <p className="text-slate-400 text-xs mt-0.5">{v.plate}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Encontrar posto <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/portal/stations" className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/30 transition-colors text-center">
          <MapPin className="mx-auto mb-2 text-emerald-400" size={24} />
          <p className="text-white text-sm font-medium">Postos</p>
          <p className="text-slate-500 text-xs mt-0.5">Encontrar recarga</p>
        </Link>
        <Link href="/portal/history" className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/30 transition-colors text-center">
          <History className="mx-auto mb-2 text-purple-400" size={24} />
          <p className="text-white text-sm font-medium">Historico</p>
          <p className="text-slate-500 text-xs mt-0.5">Recargas anteriores</p>
        </Link>
      </div>
    </div>
  );
}
