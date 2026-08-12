'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Shield, Search, Filter, ChevronLeft, ChevronRight, User, Calendar, Activity } from 'lucide-react';
import DataTable from '@/components/data-table';

interface AuditLogEntry {
  id: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ACTION_COLORS: Record<string, string> = {
  PAYMENT_APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PAYMENT_FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
  USER_CREATED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  USER_LOGIN: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  STATION_CREATED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  CHARGER_UPDATED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  SESSION_STARTED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  SESSION_COMPLETED: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: '', entity: '', userId: '' });
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 50 };
      if (filters.action) params.action = filters.action;
      if (filters.entity) params.entity = filters.entity;
      if (filters.userId) params.user_id = filters.userId;

      const { data } = await api.get('/audit', { params });
      setLogs(data.data || []);
      setPagination(data.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 });
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void load(1); }, [load]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      void load(newPage);
    }
  };

  const formatJson = (json: string | null | undefined) => {
    if (!json) return '-';
    try {
      const obj = JSON.parse(json);
      return Object.entries(obj)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    } catch {
      return json;
    }
  };

  const formatUserAgent = (ua: string | null | undefined) => {
    if (!ua) return '-';
    if (ua.length > 60) return ua.substring(0, 60) + '...';
    return ua;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="text-emerald-400" size={24} /> Logs de Auditoria
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Registro completo de acoes do sistema ({pagination.total} registros)
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700 transition-colors"
        >
          <Filter size={16} /> Filtros
        </button>
      </div>

      {showFilters && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Acao</label>
              <input
                placeholder="Ex: PAYMENT_APPROVED"
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Entidade</label>
              <input
                placeholder="Ex: Payment"
                value={filters.entity}
                onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">ID do Usuario</label>
              <input
                placeholder="ID do usuario"
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => { setFilters({ action: '', entity: '', userId: '' }); }}
              className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={() => void load(1)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm mt-3">Carregando logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Shield size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-sm">Nenhum log de auditoria encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="p-4 text-sm text-slate-400 font-medium">Data/Hora</th>
                  <th className="p-4 text-sm text-slate-400 font-medium">Acao</th>
                  <th className="p-4 text-sm text-slate-400 font-medium">Entidade</th>
                  <th className="p-4 text-sm text-slate-400 font-medium">ID Entidade</th>
                  <th className="p-4 text-sm text-slate-400 font-medium">Valores</th>
                  <th className="p-4 text-sm text-slate-400 font-medium">IP</th>
                  <th className="p-4 text-sm text-slate-400 font-medium">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-4 text-sm text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-500" />
                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${ACTION_COLORS[log.action] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-300 font-mono">{log.entity}</td>
                    <td className="p-4 text-sm text-slate-400 font-mono max-w-[120px] truncate" title={log.entityId || ''}>
                      {log.entityId ? log.entityId.substring(0, 12) + '...' : '-'}
                    </td>
                    <td className="p-4 text-sm text-slate-400 max-w-[200px] truncate" title={formatJson(log.newValue)}>
                      {formatJson(log.newValue)}
                    </td>
                    <td className="p-4 text-sm text-slate-400 font-mono">{log.ipAddress || '-'}</td>
                    <td className="p-4 text-sm text-slate-400 max-w-[150px] truncate" title={log.userAgent || ''}>
                      {formatUserAgent(log.userAgent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              Pagina {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
