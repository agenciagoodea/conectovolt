'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useChargingSocket } from '@/lib/use-charging-socket';
import { ArrowLeft, CircleStop, Loader2, Zap, Plug, Battery, CheckCircle2, Car } from 'lucide-react';
import CarChargingAnimation from '@/components/car-charging-animation';

interface Connector {
  id: string;
  type: string;
  status: string;
}

interface Charger {
  id: string;
  serialNumber: string;
  model?: string;
  powerKw: number;
  status: string;
  connectors?: Connector[];
}

interface Station {
  id: string;
  name: string;
  address: string;
  tariff?: { name: string; pricePerKwh: number };
  chargers?: Charger[];
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  batteryCapacity?: number;
}

interface Session {
  id: string;
  status: string;
  energyKwh: number;
  amount: number;
  startTime: string;
  endTime?: string;
  tariff?: { name: string; pricePerKwh: number };
  vehicle?: { id: string; brand: string; model: string; plate: string; batteryCapacity?: number };
}

function unwrap<T>(value: T | { data: T }): T {
  if (value && typeof value === 'object' && 'data' in value) {
    return value.data;
  }
  return value as T;
}

function ChargingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stationId = searchParams.get('station') || '';
  const chargerId = searchParams.get('charger') || '';
  const vehicleParam = searchParams.get('vehicle') || '';

  const [station, setStation] = useState<Station | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState(vehicleParam);
  const [connectorId, setConnectorId] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [durationSec, setDurationSec] = useState(0);

  const socket = useChargingSocket();

  const load = useCallback(async () => {
    if (!stationId || !chargerId) {
      setLoading(false);
      setError('Posto ou carregador nao informado.');
      return;
    }
    try {
      const [{ data: stationData }, { data: vehicleData }, { data: activeData }] = await Promise.all([
        api.get(`/stations/${stationId}`),
        api.get('/vehicles'),
        api.get('/charging/active').catch(() => ({ data: null })),
      ]);
      const loadedStation = unwrap<Station>(stationData);
      const loadedVehicles = unwrap<Vehicle[]>(vehicleData);
      const loadedCharger = loadedStation.chargers?.find((c) => c.id === chargerId);
      if (!loadedCharger) throw new Error('Carregador nao encontrado');
      setStation(loadedStation);
      setVehicles(loadedVehicles);
      setConnectorId(loadedCharger.connectors?.find((c) => c.status === 'AVAILABLE')?.id || '');

      if (!vehicleParam && loadedVehicles.length === 1) {
        setVehicleId(loadedVehicles[0].id);
      }

      const active = unwrap<Session | null>(activeData);
      if (active && active.status === 'ACTIVE') {
        setSession(active);
      }
    } catch {
      setError('Nao foi possivel carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [chargerId, stationId]);

  useEffect(() => { if (stationId && chargerId) void load(); }, [chargerId, load, stationId]);

  useEffect(() => {
    if (!session?.id || session.status !== 'ACTIVE') return;
    socket.subscribeSession(session.id);
    return () => { socket.unsubscribeSession(session.id); };
  }, [session?.id, session?.status]);

  useEffect(() => {
    socket.onSessionUpdate((data) => {
      setSession((prev) => {
        if (!prev || prev.id !== data.sessionId) return prev;
        return { ...prev, energyKwh: data.energyKwh, amount: data.amount || prev.amount };
      });
    });

    socket.onSessionCompleted((data) => {
      setSession((prev) => {
        if (!prev || prev.id !== data.sessionId) return prev;
        return { ...prev, status: 'COMPLETED', energyKwh: data.energyKwh, amount: data.amount || prev.amount, endTime: String(data.endTime || '') };
      });
    });
  }, [socket.onSessionUpdate, socket.onSessionCompleted]);

  useEffect(() => {
    if (!session || session.status !== 'ACTIVE') return;
    const timer = window.setInterval(async () => {
      try {
        const { data } = await api.get(`/charging/${session.id}`);
        const updated = unwrap<Session>(data);
        setSession((prev) => {
          if (!prev) return prev;
          if (updated.status === 'COMPLETED' && prev.status === 'ACTIVE') {
            router.push(`/portal/payment?session=${prev.id}&amount=${Number(updated.amount || 0).toFixed(2)}`);
            return { ...prev, status: 'COMPLETED', energyKwh: updated.energyKwh, amount: updated.amount };
          }
          return { ...prev, energyKwh: updated.energyKwh, amount: updated.amount };
        });
      } catch { /* silent */ }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [session?.id, session?.status]);

  useEffect(() => {
    if (!session || session.status !== 'ACTIVE') return;
    setDurationSec(Math.round((Date.now() - new Date(session.startTime).getTime()) / 1000));
    const timer = window.setInterval(() => {
      setDurationSec(Math.round((Date.now() - new Date(session.startTime).getTime()) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [session?.startTime, session?.status]);

  async function startCharging() {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/charging/start', {
        chargerId, stationId, connectorId: connectorId || undefined, vehicleId: vehicleId || undefined,
      });
      const started = unwrap<Session & { sessionId?: string }>(data);
      const sessionVehicle = vehicles.find((v) => v.id === vehicleId) || null;
      setSession({
        ...started,
        id: started.id || started.sessionId || '',
        vehicle: sessionVehicle ? { id: sessionVehicle.id, brand: sessionVehicle.brand, model: sessionVehicle.model, plate: sessionVehicle.plate, batteryCapacity: sessionVehicle.batteryCapacity } : undefined,
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Nao foi possivel iniciar. Verifique a disponibilidade.');
    } finally {
      setSubmitting(false);
    }
  }

  async function stopCharging() {
    if (!session) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post(`/charging/${session.id}/stop`, {
        energyKwh: Number(session.energyKwh || 0),
      });
      const finished = unwrap<Session>(data);
      router.replace(`/portal/payment?session=${session.id}&amount=${Number(finished.amount || 0).toFixed(2)}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Nao foi possivel finalizar.');
      setSubmitting(false);
    }
  }

  const charger = station?.chargers?.find((c) => c.id === chargerId);
  const pricePerKwh = Number(session?.tariff?.pricePerKwh || station?.tariff?.pricePerKwh || 0);
  const currentAmount = Number(session?.amount || 0) || Number(session?.energyKwh || 0) * pricePerKwh;
  const durationMin = Math.floor(durationSec / 60);
  const durationSecRem = durationSec % 60;
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href={vehicleId ? `/portal/stations?vehicle=${vehicleId}` : '/portal/stations'} className="inline-flex items-center gap-1.5 text-sm text-slate-400 active:text-white">
        <ArrowLeft size={16} /> Voltar
      </Link>

      <div>
        <p className="text-xs text-emerald-400 uppercase tracking-wider font-medium">{station?.name || 'Posto'}</p>
        <h2 className="text-xl font-bold text-white mt-1">{charger?.serialNumber || 'Carregador'}</h2>
        <p className="text-slate-500 text-xs mt-0.5">{charger?.model || 'Eletrico'} · {charger?.powerKw || 0} kW</p>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm text-red-400" style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d44' }}>
          {error}
        </div>
      )}

      {!session ? (
        <div className="space-y-4 rounded-2xl p-5" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
          {selectedVehicle && (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
                <Car className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold">{selectedVehicle.brand} {selectedVehicle.model}</p>
                <p className="text-slate-500 text-xs">{selectedVehicle.plate} {selectedVehicle.batteryCapacity ? `· ${selectedVehicle.batteryCapacity} kWh` : ''}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Veiculo</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-xl py-3 px-4 text-sm text-white outline-none appearance-none"
              style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}
            >
              <option value="">Sem veiculo</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.brand} {v.model} · {v.plate}</option>
              ))}
            </select>
          </div>

          {(charger?.connectors || []).length > 1 && (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Conector</label>
              <select
                value={connectorId}
                onChange={(e) => setConnectorId(e.target.value)}
                className="w-full rounded-xl py-3 px-4 text-sm text-white outline-none appearance-none"
                style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}
              >
                <option value="">Automatico</option>
                {charger?.connectors?.map((c) => (
                  <option key={c.id} value={c.id}>{c.type} · {c.status}</option>
                ))}
              </select>
            </div>
          )}

          <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: '#0a0a0a' }}>
            <span className="text-xs text-slate-400">Tarifa</span>
            <span className="text-white font-bold text-sm">R$ {pricePerKwh.toFixed(2)}/kWh</span>
          </div>

          <button
            onClick={() => void startCharging()}
            disabled={submitting || charger?.status !== 'ONLINE'}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white active:scale-[0.98] transition-transform disabled:opacity-50"
            style={{ background: '#10b981' }}
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            {submitting ? 'Iniciando...' : charger?.status === 'ONLINE' ? 'INICIAR RECARGA' : 'Indisponivel'}
          </button>
        </div>
      ) : session.status === 'COMPLETED' ? (
        <div className="space-y-4 rounded-2xl p-5" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#3b82f615' }}>
              <CheckCircle2 className="text-blue-400" size={28} />
            </div>
            <div>
              <p className="text-white font-bold">Recarga finalizada</p>
              <p className="text-slate-500 text-xs">{new Date(session.startTime).toLocaleString('pt-BR')}</p>
            </div>
          </div>

          {session.vehicle && (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#0a0a0a' }}>
              <Car className="text-slate-500" size={18} />
              <span className="text-white text-sm">{session.vehicle.brand} {session.vehicle.model} · {session.vehicle.plate}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center rounded-xl py-3" style={{ background: '#0a0a0a' }}>
              <p className="text-xl font-bold text-white">{Number(session.energyKwh || 0).toFixed(1)}</p>
              <p className="text-[10px] text-slate-500">kWh</p>
            </div>
            <div className="text-center rounded-xl py-3" style={{ background: '#0a0a0a' }}>
              <p className="text-xl font-bold text-blue-400">R$ {Number(session.amount || currentAmount).toFixed(2)}</p>
              <p className="text-[10px] text-slate-500">total</p>
            </div>
            <div className="text-center rounded-xl py-3" style={{ background: '#0a0a0a' }}>
              <p className="text-xl font-bold text-white">{durationMin}m {durationSecRem}s</p>
              <p className="text-[10px] text-slate-500">duracao</p>
            </div>
          </div>

          <Link
            href={`/portal/payment?session=${session.id}&amount=${Number(session.amount || currentAmount).toFixed(2)}`}
            className="flex items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white"
            style={{ background: '#10b981' }}
          >
            Ir para pagamento
          </Link>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl p-5" style={{ background: '#111', border: '1px solid #10b98133' }}>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#10b98115' }}>
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
              </span>
            </div>
            <div>
              <p className="text-white font-bold">Recarga em andamento</p>
              <p className="text-slate-500 text-xs">{session.vehicle ? `${session.vehicle.brand} ${session.vehicle.model} · ${session.vehicle.plate}` : new Date(session.startTime).toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <CarChargingAnimation energyKwh={session.energyKwh} />

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center rounded-xl py-3" style={{ background: '#0a0a0a' }}>
              <p className="text-xl font-bold text-white">{Number(session.energyKwh || 0).toFixed(1)}</p>
              <p className="text-[10px] text-slate-500">kWh</p>
            </div>
            <div className="text-center rounded-xl py-3" style={{ background: '#0a0a0a' }}>
              <p className="text-xl font-bold text-emerald-400">R$ {currentAmount.toFixed(2)}</p>
              <p className="text-[10px] text-slate-500">parcial</p>
            </div>
            <div className="text-center rounded-xl py-3" style={{ background: '#0a0a0a' }}>
              <p className="text-xl font-bold text-white">{durationMin}m {String(durationSecRem).padStart(2, '0')}s</p>
              <p className="text-[10px] text-slate-500">tempo</p>
            </div>
          </div>

          <button
            onClick={() => void stopCharging()}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white active:scale-[0.98] transition-transform disabled:opacity-50"
            style={{ background: '#ef4444' }}
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <CircleStop size={20} />}
            {submitting ? 'Finalizando...' : 'PARAR RECARGA'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ChargingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-400" size={32} /></div>}>
      <ChargingContent />
    </Suspense>
  );
}
