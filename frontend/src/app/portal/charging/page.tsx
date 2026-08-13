'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useChargingSocket } from '@/lib/use-charging-socket';
import { ArrowLeft, CircleStop, Loader2, Zap, Plug, Battery, CheckCircle2 } from 'lucide-react';

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

  const socket = useChargingSocket();

  const load = useCallback(async () => {
    if (!stationId || !chargerId) {
      setLoading(false);
      setError('Posto ou carregador nao informado.');
      return;
    }
    try {
      const [{ data: stationData }, { data: vehicleData }] = await Promise.all([
        api.get(`/stations/${stationId}`),
        api.get('/vehicles'),
      ]);
      const loadedStation = unwrap<Station>(stationData);
      const loadedVehicles = unwrap<Vehicle[]>(vehicleData);
      const loadedCharger = loadedStation.chargers?.find((c) => c.id === chargerId);
      if (!loadedCharger) throw new Error('Carregador nao encontrado');
      setStation(loadedStation);
      setVehicles(loadedVehicles);
      setConnectorId(loadedCharger.connectors?.find((c) => c.status === 'AVAILABLE')?.id || '');
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
            return { ...prev, status: 'COMPLETED', energyKwh: updated.energyKwh, amount: updated.amount, endTime: updated.endTime };
          }
          return { ...prev, energyKwh: updated.energyKwh, amount: updated.amount };
        });
      } catch { /* silent */ }
    }, 10000);
    return () => window.clearInterval(timer);
  }, [session?.id, session?.status]);

  async function startCharging() {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/charging/start', {
        chargerId, stationId, connectorId: connectorId || undefined, vehicleId: vehicleId || undefined,
      });
      const started = unwrap<Session & { sessionId?: string }>(data);
      setSession({ ...started, id: started.id || started.sessionId || '' });
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
      setSession(finished);
      router.push(`/portal/payment?session=${session.id}&amount=${Number(finished.amount || 0).toFixed(2)}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Nao foi possivel finalizar.');
    } finally {
      setSubmitting(false);
    }
  }

  const charger = station?.chargers?.find((c) => c.id === chargerId);
  const pricePerKwh = Number(session?.tariff?.pricePerKwh || station?.tariff?.pricePerKwh || 0);
  const currentAmount = Number(session?.amount || 0) || Number(session?.energyKwh || 0) * pricePerKwh;
  const durationMin = session ? Math.round((Date.now() - new Date(session.startTime).getTime()) / 60000) : 0;

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
              <p className="text-xl font-bold text-white">{durationMin}</p>
              <p className="text-[10px] text-slate-500">min</p>
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
              <p className="text-slate-500 text-xs">{new Date(session.startTime).toLocaleString('pt-BR')}</p>
            </div>
          </div>

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
              <p className="text-xl font-bold text-white">{durationMin}</p>
              <p className="text-[10px] text-slate-500">min</p>
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
