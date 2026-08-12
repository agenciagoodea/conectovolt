'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Wifi,
  WifiOff,
  Activity,
  Zap,
  CheckSquare,
  Square,
  AlertTriangle,
  Radio,
} from 'lucide-react';

interface Station {
  id: string;
  name: string;
}

interface Connector {
  id: string;
  type: string;
  powerKw?: number;
  status: string;
}

interface TelemetryData {
  powerKw: number;
  energyKwh: number;
  voltage: number;
  current: number;
  frequency: number;
  timestamp: number;
}

interface Tariff {
  id: string;
  name: string;
  pricePerKwh: number;
  isActive: boolean;
}

interface Charger {
  id: string;
  serialNumber: string;
  model?: string;
  manufacturer?: string;
  powerKw: number;
  status: string;
  ocppId?: string;
  station?: { id: string; name: string; tariff?: Tariff };
  connectors?: Connector[];
}

const CONNECTOR_TYPES = ['TYPE2', 'CCS', 'CHADEMO'];
const CONNECTOR_LABELS: Record<string, string> = { TYPE2: 'Tipo 2 (AC)', CCS: 'CCS (DC)', CHADEMO: 'CHAdeMO (DC)' };

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api/v1', '') || '';

export default function ChargersPage() {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCharger, setEditingCharger] = useState<Charger | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [expandedCharger, setExpandedCharger] = useState<string | null>(null);
  const [connectorForm, setConnectorForm] = useState<{ chargerId: string; type: string; powerKw: string } | null>(null);
  const [form, setForm] = useState({ stationId: '', serialNumber: '', model: '', manufacturer: '', powerKw: '0', ocppId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [connectedCount, setConnectedCount] = useState(0);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [connectorTelemetry, setConnectorTelemetry] = useState<Record<string, TelemetryData>>({});

  // Multi-select bulk deletion state
  const [selectedChargerIds, setSelectedChargerIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/chargers');
      setChargers(data);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const loadStations = useCallback(async () => {
    try {
      const { data } = await api.get('/stations');
      setStations(data);
    } catch {
      /* ignore */
    }
  }, []);

  const loadConnections = useCallback(async () => {
    try {
      const { data } = await api.get('/chargers/connections');
      setConnectedCount(data.length || 0);
    } catch {
      /* ignore */
    }
  }, []);

  const loadTelemetry = useCallback(async () => {
    try {
      const { data } = await api.get('/chargers/telemetry');
      setConnectorTelemetry(data);
    } catch {
      /* ignore */
    }
  }, []);

  // Set up real-time Socket.io listener for status updates
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;

    const socket = io(`${SOCKET_URL}/charging`, {
      transports: ['websocket'],
      autoConnect: true,
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('charger:status', ({ chargerId, status }: { chargerId: string; status: string }) => {
      setChargers((prev) =>
        prev.map((c) => (c.id === chargerId ? { ...c, status } : c))
      );
    });

    socket.on(
      'connector:status',
      ({ chargerId, connectorId, status }: { chargerId: string; connectorId: string; status: string }) => {
        setChargers((prev) =>
          prev.map((c) => {
            if (c.id === chargerId && c.connectors) {
              return {
                ...c,
                connectors: c.connectors.map((conn) => (conn.id === connectorId ? { ...conn, status } : conn)),
              };
            }
            return c;
          })
        );
      }
    );

    socket.on(
      'connector:telemetry',
      (data: { chargerId: string; connectorId: string; powerKw: number; energyKwh: number; voltage: number; current: number; frequency: number; timestamp: number }) => {
        setConnectorTelemetry((prev) => ({
          ...prev,
          [data.connectorId]: {
            powerKw: data.powerKw,
            energyKwh: data.energyKwh,
            voltage: data.voltage,
            current: data.current,
            frequency: data.frequency,
            timestamp: data.timestamp,
          },
        }));
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    void load();
    void loadStations();
    void loadConnections();
    void loadTelemetry();
  }, [load, loadStations, loadConnections, loadTelemetry]);

  const testConnection = useCallback(
    async (id: string, serialNumber: string) => {
      setTestingId(id);
      setStatusMessage(null);
      try {
        const { data } = await api.get(`/chargers/${id}/test-connection`);
        setStatusMessage({
          text: data.connected
            ? `Carregador ${serialNumber} conectado via OCPP!`
            : `Carregador ${serialNumber} não conectado: ${data.reason || 'WebSocket inativo'}`,
          type: data.connected ? 'success' : 'error',
        });
        void loadConnections();
      } catch {
        setStatusMessage({ text: 'Erro ao testar conexão', type: 'error' });
      } finally {
        setTestingId(null);
      }
    },
    [loadConnections]
  );

  const openCreate = () => {
    setEditingCharger(null);
    setForm({ stationId: '', serialNumber: '', model: '', manufacturer: '', powerKw: '0', ocppId: '' });
    setError('');
    setShowForm(true);
  };

  const openEdit = (c: Charger) => {
    setEditingCharger(c);
    setForm({
      stationId: c.station?.id || '',
      serialNumber: c.serialNumber,
      model: c.model || '',
      manufacturer: c.manufacturer || '',
      powerKw: String(c.powerKw || 0),
      ocppId: c.ocppId || '',
    });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      try {
        const payload = { ...form, powerKw: parseFloat(form.powerKw) || 0 };
        if (editingCharger) {
          await api.patch(`/chargers/${editingCharger.id}`, payload);
        } else {
          await api.post('/chargers', payload);
        }
        setShowForm(false);
        void load();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar carregador');
      } finally {
        setSubmitting(false);
      }
    },
    [form, editingCharger, load]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Tem certeza que deseja remover este carregador?')) return;
      setError('');
      try {
        await api.delete(`/chargers/${id}`);
        setSelectedChargerIds((prev) => prev.filter((i) => i !== id));
        void load();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao remover carregador');
      }
    },
    [load]
  );

  // Multi-select actions
  const toggleSelectAll = () => {
    if (selectedChargerIds.length === chargers.length) {
      setSelectedChargerIds([]);
    } else {
      setSelectedChargerIds(chargers.map((c) => c.id));
    }
  };

  const toggleSelectCharger = (id: string) => {
    setSelectedChargerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedChargerIds.length === 0) return;
    setBulkDeleting(true);
    setError('');
    try {
      await api.post('/chargers/bulk-delete', { ids: selectedChargerIds });
      setSelectedChargerIds([]);
      setShowBulkDeleteModal(false);
      void load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro na exclusão em lote');
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleExpand = useCallback(
    async (chargerId: string) => {
      if (expandedCharger === chargerId) {
        setExpandedCharger(null);
        setConnectorForm(null);
        return;
      }
      setExpandedCharger(chargerId);
      setConnectorForm(null);
      try {
        const { data } = await api.get(`/connectors/charger/${chargerId}`);
        setChargers((prev) => prev.map((c) => (c.id === chargerId ? { ...c, connectors: data } : c)));
      } catch {
        /* ignore */
      }
    },
    [expandedCharger]
  );

  const handleAddConnector = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!connectorForm) return;
      setSubmitting(true);
      setError('');
      try {
        await api.post(`/connectors/charger/${connectorForm.chargerId}`, {
          type: connectorForm.type,
          powerKw: connectorForm.powerKw ? parseInt(connectorForm.powerKw) : undefined,
        });
        const chargerId = connectorForm.chargerId;
        setConnectorForm(null);
        void toggleExpand(chargerId);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao adicionar conector');
      } finally {
        setSubmitting(false);
      }
    },
    [connectorForm, toggleExpand]
  );

  const handleDeleteConnector = useCallback(
    async (id: string, chargerId: string) => {
      if (!confirm('Remover este conector?')) return;
      setError('');
      try {
        await api.delete(`/connectors/${id}`);
        void toggleExpand(chargerId);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao remover conector');
      }
    },
    [toggleExpand]
  );

  // Status visual badge renderings
  const chargerStatusBadge = (status: string) => {
    const isOnline = status === 'ONLINE';
    const isError = status === 'ERROR';

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
          isOnline
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-900/20'
            : isError
            ? 'bg-red-500/10 text-red-400 border-red-500/30'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-emerald-400 animate-ping' : isError ? 'bg-red-400 animate-pulse' : 'bg-slate-500'
          }`}
        />
        <span
          className={`w-2 h-2 rounded-full absolute ${
            isOnline ? 'bg-emerald-400' : isError ? 'bg-red-400' : 'bg-slate-500'
          }`}
        />
        <span className="ml-2">{isOnline ? 'ONLINE' : isError ? 'ERRO' : 'OFFLINE'}</span>
      </span>
    );
  };

  const connectorStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; label: string }> = {
      AVAILABLE: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Livre / Disponível' },
      CHARGING: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse', label: 'Ocupado / Carregando' },
      FAULT: { bg: 'bg-red-500/10 text-red-400 border-red-500/30', label: 'Falha' },
      UNAVAILABLE: { bg: 'bg-slate-800 text-slate-400 border-slate-700', label: 'Indisponível' },
    };
    const s = styles[status] || styles.UNAVAILABLE;
    return <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${s.bg}`}>{s.label}</span>;
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="text-emerald-400" size={24} /> Gerenciador de Carregadores
            </h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Radio size={14} className="text-emerald-400 animate-pulse" /> Monitoramento de status em tempo real sem reload
            </p>
          </div>

          <button
            onClick={loadConnections}
            className={`flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all ${
              connectedCount > 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
            title="Atualizar total de carregadores conectados ao WebSocket"
          >
            <Wifi size={13} />
            {connectedCount} OCPP Online
          </button>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <Plus size={18} /> Novo Carregador
        </button>
      </div>

      {/* BARRA FLUTUANTE DE AÇÃO EM LOTE (BULK ACTION) */}
      {selectedChargerIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-950 to-slate-900 border-2 border-emerald-500/40 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckSquare size={20} />
            </div>
            <span className="text-sm font-semibold text-white">
              {selectedChargerIds.length} carregador(es) selecionado(s)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedChargerIds([])}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Desmarcar Todos
            </button>
            <button
              onClick={() => setShowBulkDeleteModal(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-red-900/30 transition-all active:scale-95"
            >
              <Trash2 size={15} /> Excluir Selecionados ({selectedChargerIds.length})
            </button>
          </div>
        </div>
      )}

      {/* MENSAGEM DE STATUS */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-2 shadow-lg ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <Wifi size={18} /> : <WifiOff size={18} />}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO EM LOTE */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Confirmar Exclusão Múltipla</h3>
            </div>
            <p className="text-sm text-slate-300">
              Você está prestes a remover <strong className="text-white">{selectedChargerIds.length} carregadores</strong> simultaneamente. Esta ação apagará também os conectores vinculados e não poderá ser desfeita.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-lg shadow-red-900/30 transition-all disabled:opacity-50"
              >
                {bulkDeleting ? 'Excluindo...' : 'Sim, Excluir Carregadores'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO DE CADASTRO / EDIÇÃO */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl backdrop-blur space-y-6"
        >
          {error && <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-sm">{error}</div>}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingCharger ? 'Editar Carregador' : 'Cadastrar Novo Carregador'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Posto de Recarga</label>
              <select
                value={form.stationId}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, stationId: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                required
              >
                <option value="">Selecione o posto</option>
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Número de Série</label>
              <input
                placeholder="Ex: SN-ABC12345"
                value={form.serialNumber}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, serialNumber: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Modelo</label>
              <input
                placeholder="Ex: Wallbox Pro 22kW"
                value={form.model}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, model: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Fabricante</label>
              <input
                placeholder="Ex: ABB / WEG / Enel"
                value={form.manufacturer}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, manufacturer: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Potência (kW)</label>
              <input
                placeholder="Ex: 60"
                type="number"
                step="any"
                value={form.powerKw}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, powerKw: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">OCPP ID (Identificador WebSocket)</label>
              <input
                placeholder="Ex: OCPP-CENTRO-01"
                value={form.ocppId}
                onChange={(e) => {
                  setError('');
                  setForm({ ...form, ocppId: e.target.value });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-mono outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Salvar Carregador'}
            </button>
          </div>
        </form>
      )}

      {/* TABELA DE CARREGADORES */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Selecionar Todos"
                  >
                    {chargers.length > 0 && selectedChargerIds.length === chargers.length ? (
                      <CheckSquare size={18} className="text-emerald-400" />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th className="p-4 w-8"></th>
                <th className="p-4">Serial / OCPP ID</th>
                <th className="p-4">Posto</th>
                <th className="p-4">Modelo / Marca</th>
                <th className="p-4">Potência</th>
                <th className="p-4">Status Tempo Real</th>
                <th className="p-4">Conectores</th>
                <th className="p-4 text-right pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {chargers.map((c) => {
                const isSelected = selectedChargerIds.includes(c.id);

                return (
                  <React.Fragment key={c.id}>
                    <tr
                      className={`transition-colors ${
                        isSelected ? 'bg-emerald-950/20 hover:bg-emerald-950/30' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleSelectCharger(c.id)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {isSelected ? <CheckSquare size={18} className="text-emerald-400" /> : <Square size={18} />}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleExpand(c.id)}
                          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          {expandedCharger === c.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-white font-semibold text-sm">{c.serialNumber}</div>
                        {c.ocppId && <div className="text-xs text-emerald-400 font-mono mt-0.5">{c.ocppId}</div>}
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{c.station?.name || '-'}</td>
                      <td className="p-4 text-slate-300">
                        {c.model || '-'} {c.manufacturer ? `(${c.manufacturer})` : ''}
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-white text-sm">{Number(c.powerKw)} kW</div>
                        {c.station?.tariff && (
                          <div className="text-xs text-emerald-400 mt-0.5">
                            {c.station.tariff.name} — R${Number(c.station.tariff.pricePerKwh).toFixed(2)}/kWh
                          </div>
                        )}
                      </td>
                      <td className="p-4">{chargerStatusBadge(c.status)}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {c.connectors?.length || 0} conector(es)
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => testConnection(c.id, c.serialNumber)}
                            disabled={testingId === c.id}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                            title="Testar Conexão WebSocket OCPP"
                          >
                            {testingId === c.id ? (
                              <svg
                                className="animate-spin"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                            ) : (
                              <Activity size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Editar Carregador"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Remover Carregador"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANSÃO DE CONECTORES */}
                    {expandedCharger === c.id && (
                      <tr key={`${c.id}-connectors`}>
                        <td colSpan={9} className="bg-slate-950/60 p-0 border-b border-slate-800">
                          <div className="px-8 py-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Zap size={15} className="text-emerald-400" /> Conectores do Carregador ({c.serialNumber})
                              </h4>
                              {!connectorForm && (
                                <button
                                  onClick={() => setConnectorForm({ chargerId: c.id, type: 'TYPE2', powerKw: '' })}
                                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
                                >
                                  <Plus size={14} /> Adicionar Conector
                                </button>
                              )}
                            </div>

                            {connectorForm && connectorForm.chargerId === c.id && (
                              <form
                                onSubmit={handleAddConnector}
                                className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-lg"
                              >
                                <select
                                  value={connectorForm.type}
                                  onChange={(e) => {
                                    setError('');
                                    setConnectorForm({ ...connectorForm, type: e.target.value });
                                  }}
                                  className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs outline-none"
                                >
                                  {CONNECTOR_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                      {CONNECTOR_LABELS[t]}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  placeholder="Potência (kW)"
                                  type="number"
                                  value={connectorForm.powerKw}
                                  onChange={(e) => {
                                    setError('');
                                    setConnectorForm({ ...connectorForm, powerKw: e.target.value });
                                  }}
                                  className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs w-28 font-mono outline-none"
                                />
                                <button
                                  type="submit"
                                  disabled={submitting}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                >
                                  {submitting ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConnectorForm(null)}
                                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-lg text-xs"
                                >
                                  Cancelar
                                </button>
                              </form>
                            )}

                            {(c.connectors || []).length === 0 && !connectorForm && (
                              <p className="text-xs text-slate-500 italic py-1">Nenhum conector cadastrado para este carregador.</p>
                            )}

                            <div className="flex flex-wrap gap-3">
                              {(c.connectors || []).map((con) => {
                                const tel = connectorTelemetry[con.id];
                                const isCharging = con.status === 'CHARGING';
                                return (
                                  <div
                                    key={con.id}
                                    className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition-all ${
                                      isCharging
                                        ? 'bg-blue-500/5 border-blue-500/30'
                                        : 'bg-slate-900 border-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-white font-semibold">
                                        {CONNECTOR_LABELS[con.type] || con.type}
                                      </span>
                                      {con.powerKw != null && con.powerKw > 0 && (
                                        <span className="text-xs font-mono text-slate-400">{Number(con.powerKw)} kW</span>
                                      )}
                                      {connectorStatusBadge(con.status)}
                                    </div>
                                    {tel && isCharging && (
                                      <div className="flex items-center gap-4 text-xs font-mono">
                                        <span className="text-blue-400 font-semibold">
                                          <Zap size={11} className="inline mr-0.5" />
                                          {tel.powerKw.toFixed(1)} kW
                                        </span>
                                        <span className="text-emerald-400">
                                          {tel.energyKwh.toFixed(2)} kWh
                                        </span>
                                        {tel.voltage > 0 && (
                                          <span className="text-slate-400">
                                            {tel.voltage.toFixed(0)}V / {tel.current.toFixed(1)}A
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    <button
                                      onClick={() => handleDeleteConnector(con.id, c.id)}
                                      className="text-red-400 hover:text-red-300 p-1 rounded transition-colors sm:ml-auto"
                                      title="Remover conector"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {chargers.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    Nenhum carregador cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
