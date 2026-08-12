'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Car, CircleStop, Loader2, Zap } from 'lucide-react';

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

export default function ChargingPage() {
  const router = useRouter();
  const [stationId, setStationId] = useState('');
  const [chargerId, setChargerId] = useState('');
  const [station, setStation] = useState<Station | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState('');
  const [connectorId, setConnectorId] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStationId(params.get('station') || '');
    setChargerId(params.get('charger') || '');
  }, []);

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
      const loadedCharger = loadedStation.chargers?.find((item) => item.id === chargerId);

      if (!loadedCharger) {
        throw new Error('Carregador nao encontrado neste posto.');
      }

      setStation(loadedStation);
      setVehicles(loadedVehicles);
      setConnectorId(
        loadedCharger.connectors?.find((item) => item.status === 'AVAILABLE')?.id || '',
      );
    } catch {
      setError('Nao foi possivel carregar os dados da recarga.');
    } finally {
      setLoading(false);
    }
  }, [chargerId, stationId]);

  useEffect(() => {
    if (stationId && chargerId) void load();
  }, [chargerId, load, stationId]);

  const refreshSession = useCallback(async () => {
    if (!session?.id) return;
    try {
      const { data } = await api.get(`/charging/${session.id}`);
      setSession(unwrap<Session>(data));
    } catch {
      setError('Nao foi possivel atualizar o status da recarga.');
    }
  }, [session]);

  useEffect(() => {
    if (!session || session.status !== 'ACTIVE') return;
    const timer = window.setInterval(() => void refreshSession(), 5000);
    return () => window.clearInterval(timer);
  }, [refreshSession, session]);

  async function startCharging() {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/charging/start', {
        chargerId,
        stationId,
        connectorId: connectorId || undefined,
        vehicleId: vehicleId || undefined,
      });
      const started = unwrap<Session & { sessionId?: string }>(data);
      setSession({ ...started, id: started.id || started.sessionId || '' });
    } catch {
      setError('Nao foi possivel iniciar a recarga. Verifique a disponibilidade do carregador.');
    } finally {
      setSubmitting(false);
    }
  }

  async function stopCharging() {
    if (!session) return;
    const energyKwh = Number(session.energyKwh || 0);
    if (energyKwh <= 0) {
      setError('A recarga ainda nao recebeu telemetria de energia.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post(`/charging/${session.id}/stop`, { energyKwh });
      const finished = unwrap<Session>(data);
      setSession(finished);
      router.push(`/portal/payment?session=${encodeURIComponent(session.id)}&amount=${encodeURIComponent(Number(finished.amount || 0).toFixed(2))}`);
    } catch {
      setError('Nao foi possivel finalizar a recarga.');
    } finally {
      setSubmitting(false);
    }
  }

  const charger = station?.chargers?.find((item) => item.id === chargerId);
  const pricePerKwh = Number(session?.tariff?.pricePerKwh || station?.tariff?.pricePerKwh || 0);
  const currentAmount = Number(session?.amount || 0) || Number(session?.energyKwh || 0) * pricePerKwh;

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-400" /></div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/portal/stations" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Voltar aos postos
      </Link>

      <div className="mb-6">
        <p className="text-sm text-emerald-400">Recarga</p>
        <h2 className="text-2xl font-bold text-white">{station?.name || 'Carregador'}</h2>
        <p className="mt-1 text-sm text-slate-400">{station?.address}</p>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

      {!session ? (
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Zap className="text-emerald-400" />
            <div>
              <p className="font-medium text-white">{charger?.serialNumber || 'Carregador'}</p>
              <p className="text-sm text-slate-400">{charger?.model || 'Carregador eletrico'} · {charger?.powerKw || 0} kW</p>
            </div>
          </div>

          <label className="block text-sm text-slate-300">
            Veiculo
            <select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} className="input-field mt-2">
              <option value="">Sem veiculo selecionado</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} · {vehicle.plate}</option>)}
            </select>
          </label>

          <label className="block text-sm text-slate-300">
            Conector
            <select value={connectorId} onChange={(event) => setConnectorId(event.target.value)} className="input-field mt-2">
              <option value="">Automatico</option>
              {(charger?.connectors || []).map((connector) => <option key={connector.id} value={connector.id}>{connector.type} · {connector.status}</option>)}
            </select>
          </label>

          <div className="rounded-lg bg-slate-800 p-4 text-sm text-slate-300">
            Tarifa: <strong className="text-white">R$ {pricePerKwh.toFixed(2)}/kWh</strong>
          </div>
          <button onClick={() => void startCharging()} disabled={submitting || charger?.status !== 'ONLINE'} className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-50">
            {submitting ? 'Iniciando...' : charger?.status === 'ONLINE' ? 'Iniciar recarga' : 'Carregador indisponivel'}
          </button>
        </div>
      ) : (
        <div className="space-y-5 rounded-xl border border-emerald-500/20 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10"><Zap className="text-emerald-400" /></div>
            <div><p className="font-medium text-white">{session.status === 'ACTIVE' ? 'Recarga em andamento' : 'Recarga finalizada'}</p><p className="text-sm text-slate-400">{new Date(session.startTime).toLocaleString('pt-BR')}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-800 p-4"><p className="text-xs text-slate-400">Energia</p><p className="mt-1 text-xl font-bold text-white">{Number(session.energyKwh || 0).toFixed(2)} kWh</p></div>
            <div className="rounded-lg bg-slate-800 p-4"><p className="text-xs text-slate-400">Valor parcial</p><p className="mt-1 text-xl font-bold text-emerald-400">R$ {currentAmount.toFixed(2)}</p></div>
          </div>
          {session.status === 'ACTIVE' ? (
            <button onClick={() => void stopCharging()} disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white disabled:opacity-50"><CircleStop size={18} />{submitting ? 'Finalizando...' : 'Finalizar recarga'}</button>
          ) : (
            <Link href={`/portal/payment?session=${encodeURIComponent(session.id)}&amount=${encodeURIComponent(Number(session.amount || currentAmount).toFixed(2))}`} className="block w-full rounded-lg bg-emerald-600 px-4 py-3 text-center font-medium text-white">Ir para pagamento</Link>
          )}
        </div>
      )}

      <Link href="/portal/vehicles" className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white"><Car size={15} /> Gerenciar veiculos</Link>
    </div>
  );
}
