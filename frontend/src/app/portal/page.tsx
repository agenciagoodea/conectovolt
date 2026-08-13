'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useChargingSocket } from '@/lib/use-charging-socket';
import { Zap, Car, MapPin, History, Plus, Battery, ArrowRight, CircleStop, Plug } from 'lucide-react';

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
  station?: { id: string; name: string; address: string };
  charger?: { id: string; serialNumber: string; ocppId?: string };
  connector?: { id: string; type: string };
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

  const socket = useChargingSocket();

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
    if (!activeSession?.id || activeSession.status !== 'ACTIVE') return;
    socket.subscribeSession(activeSession.id);
    return () => { socket.unsubscribeSession(activeSession.id); };
  }, [activeSession?.id, activeSession?.status]);

  useEffect(() => {
    socket.onSessionUpdate((data) => {
      setActiveSession((prev) => {
        if (!prev || prev.id !== data.sessionId || prev.status !== 'ACTIVE') return prev;
        return { ...prev, energyKwh: data.energyKwh, amount: data.amount || prev.amount };
      });
    });

    socket.onSessionCompleted((data) => {
      setActiveSession((prev) => {
        if (!prev || prev.id !== data.sessionId) return prev;
        return { ...prev, status: 'COMPLETED', energyKwh: data.energyKwh, amount: data.amount || prev.amount };
      });
    });
  }, [socket.onSessionUpdate, socket.onSessionCompleted]);

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'ACTIVE') return;
    const timer = window.setInterval(async () => {
      try {
        const { data } = await api.get(`/charging/${activeSession.id}`);
        const updated = unwrap<ActiveSession>(data);
        setActiveSession((prev) => {
          if (!prev) return prev;
          return { ...prev, energyKwh: updated.energyKwh, amount: updated.amount, status: updated.status };
        });
      } catch { /* silent */ }
    }, 10000);
    return () => window.clearInterval(timer);
  }, [activeSession?.id, activeSession?.status]);

  const pricePerKwh = Number(activeSession?.tariff?.pricePerKwh || 0);
  const currentAmount = Number(activeSession?.amount || 0) || Number(activeSession?.energyKwh || 0) * pricePerKwh;
  const durationMin = activeSession
    ? Math.round((Date.now() - new Date(activeSession.startTime).getTime()) / 60000)
    : 0;

  async function handleStop() {
    if (!activeSession) return;
    try {
      const { data } = await api.post(`/charging/${activeSession.id}/stop`, {
        energyKwh: Number(activeSession.energyKwh || 0),
      });
      const finished = unwrap<ActiveSession>(data);
      router.push(`/portal/payment?session=${finished.id}&amount=${Number(finished.amount || 0).toFixed(2)}`);
    } catch {
      alert('Nao foi possivel finalizar. Tente novamente.');
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="h-10 w-40 bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-24 bg-slate-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => <div key={i} className="h-28 bg-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">Bem-vindo</p>
        <h1 className="text-2xl font-bold text-white">{user?.name?.split(' ')[0] || 'Motorista'}</h1>
      </div>

      {activeSession && activeSession.status === 'ACTIVE' ? (
        <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)', border: '1px solid #10b98133' }}>
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> AO VIVO
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Plug className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Recarga em andamento</p>
              <p className="text-emerald-200/60 text-xs">{activeSession.station?.name || 'Posto'} · {activeSession.charger?.serialNumber || ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center bg-black/20 rounded-xl py-3">
              <p className="text-2xl font-bold text-white">{Number(activeSession.energyKwh || 0).toFixed(1)}</p>
              <p className="text-[10px] text-emerald-200/50 mt-0.5">kWh</p>
            </div>
            <div className="text-center bg-black/20 rounded-xl py-3">
              <p className="text-2xl font-bold text-emerald-400">R$ {currentAmount.toFixed(2)}</p>
              <p className="text-[10px] text-emerald-200/50 mt-0.5">parcial</p>
            </div>
            <div className="text-center bg-black/20 rounded-xl py-3">
              <p className="text-2xl font-bold text-white">{durationMin}</p>
              <p className="text-[10px] text-emerald-200/50 mt-0.5">minutos</p>
            </div>
          </div>
          <button onClick={handleStop} className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 py-3.5 text-sm font-bold text-white active:scale-[0.98] transition-transform">
            <CircleStop size={18} /> PARAR RECARGA
          </button>
        </div>
      ) : activeSession && activeSession.status === 'COMPLETED' ? (
        <Link
          href={`/portal/payment?session=${activeSession.id}&amount=${Number(activeSession.amount || 0).toFixed(2)}`}
          className="block rounded-2xl p-5 text-center active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', border: '1px solid #3b82f633' }}
        >
          <Zap className="mx-auto mb-2 text-blue-400" size={32} />
          <p className="text-white font-bold">Ultima recarga pendente</p>
          <p className="text-blue-300 text-sm mt-1">R$ {Number(activeSession.amount || 0).toFixed(2)}</p>
        </Link>
      ) : (
        <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)', border: '1px solid #10b98133' }}>
          <Zap className="mx-auto mb-2 text-emerald-400" size={32} />
          <p className="text-white font-bold">Nenhuma recarga ativa</p>
          <p className="text-slate-400 text-xs mt-1">Selecione um veiculo abaixo para comecar</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold">Meus Veiculos</h2>
          <Link href="/portal/vehicles" className="text-emerald-400 text-xs flex items-center gap-1">
            <Plus size={14} /> novo
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <Link href="/portal/vehicles" className="block rounded-2xl border-2 border-dashed border-slate-800 p-8 text-center active:bg-slate-900">
            <Car className="mx-auto mb-2 text-slate-700" size={36} />
            <p className="text-sm text-slate-500 font-medium">Cadastrar primeiro veiculo</p>
          </Link>
        ) : (
          <div className="space-y-3">
            {vehicles.map((v) => (
              <Link
                key={v.id}
                href={`/portal/stations?vehicle=${v.id}`}
                className="flex items-center gap-4 rounded-2xl p-4 active:scale-[0.98] transition-transform"
                style={{ background: '#111', border: '1px solid #1f1f1f' }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
                  <Car className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base">{v.brand} {v.model}</p>
                  <p className="text-slate-400 text-sm">{v.plate}</p>
                  {v.batteryCapacity && (
                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                      <Battery size={10} /> {v.batteryCapacity} kWh
                    </p>
                  )}
                </div>
                <ArrowRight className="text-slate-600 shrink-0" size={20} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/portal/stations" className="flex flex-col items-center gap-2 rounded-2xl p-5 active:scale-[0.98] transition-transform" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <MapPin className="text-emerald-400" size={22} />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-bold">Postos</p>
            <p className="text-slate-500 text-[10px]">Encontrar recarga</p>
          </div>
        </Link>
        <Link href="/portal/history" className="flex flex-col items-center gap-2 rounded-2xl p-5 active:scale-[0.98] transition-transform" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <History className="text-purple-400" size={22} />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-bold">Historico</p>
            <p className="text-slate-500 text-[10px]">Recargas anteriores</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
