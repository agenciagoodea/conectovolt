'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { Zap, Building2, Plug, Wallet, Activity, Radio } from 'lucide-react';
import BarChart from '@/components/charts/bar-chart';
import LineChart from '@/components/charts/line-chart';

interface DashboardData {
  revenue?: number;
  sessions?: number;
  energy?: number;
  activeChargers?: number;
  balance?: number;
  totalRevenue?: number;
  commission?: number;
  operators?: number;
  activeStations?: number;
  onlineChargers?: number;
  totalSessions?: number;
}

interface ChartData {
  labels: string[];
  revenue: number[];
  sessions: number[];
  energy: number[];
}

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api/v1', '') || '';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const chargerStatusesRef = useRef<Map<string, string>>(new Map());

  const load = useCallback(async () => {
    setError(null);
    try {
      if (user?.role === 'SUPER_ADMIN') {
        const [{ data: adminData }, { data: chartData }] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/dashboard/admin/chart'),
        ]);
        setData(adminData);
        setChart(chartData);
      } else if (user?.role === 'OPERATOR' && user?.companyId) {
        const [{ data: opData }, { data: chartData }] = await Promise.all([
          api.get(`/dashboard/operator?company_id=${user.companyId}`),
          api.get('/dashboard/operator/chart'),
        ]);
        setData(opData);
        setChart(chartData);
      }
    } catch {
      setError('Erro ao carregar dashboard. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token || !user) return;

    if (userIdRef.current === user.id && socketRef.current?.connected) return;
    userIdRef.current = user.id;

    const socket = io(`${SOCKET_URL}/charging`, {
      transports: ['websocket'],
      autoConnect: true,
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('charger:status', ({ chargerId, status }: { chargerId: string; status: string }) => {
      chargerStatusesRef.current.set(chargerId, status);
      setData((prev) => {
        if (!prev) return prev;
        const onlineCount = Array.from(chargerStatusesRef.current.values()).filter((s) => s === 'ONLINE').length;
        return { ...prev, onlineChargers: onlineCount, activeChargers: onlineCount };
      });
    });

    socket.on('session:completed', (d: { chargerId: string; status: string; energyKwh: number; amount: number }) => {
      setData((prev) => {
        if (!prev) return prev;
        const isSuperAdmin = user?.role === 'SUPER_ADMIN';
        if (isSuperAdmin) {
          return {
            ...prev,
            totalSessions: (prev.totalSessions || 0) + 1,
            totalRevenue: (prev.totalRevenue || 0) + (d.amount || 0),
            commission: (prev.commission || 0) + ((d.amount || 0) * 0.05),
          };
        }
        return {
          ...prev,
          sessions: (prev.sessions || 0) + 1,
          revenue: (prev.revenue || 0) + (d.amount || 0),
          energy: (prev.energy || 0) + (d.energyKwh || 0),
        };
      });
    });

    socket.on('session:started', () => {
      setData((prev) => {
        if (!prev) return prev;
        const isSuperAdmin = user?.role === 'SUPER_ADMIN';
        if (isSuperAdmin) {
          return { ...prev, totalSessions: (prev.totalSessions || 0) + 1 };
        }
        return { ...prev, sessions: (prev.sessions || 0) + 1 };
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400">
          {error}
          <button onClick={() => void load()} className="ml-3 underline hover:text-red-300">Tentar novamente</button>
        </div>
      )}

      {user?.role === 'SUPER_ADMIN' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<Wallet />} label="Receita Total" value={`R$ ${Number(data?.totalRevenue || 0).toFixed(2)}`} color="emerald" />
            <StatCard icon={<Activity />} label="Comissao Plataforma" value={`R$ ${Number(data?.commission || 0).toFixed(2)}`} color="blue" />
            <StatCard icon={<Building2 />} label="Operadores" value={data?.operators || 0} color="purple" />
            <StatCard icon={<Zap />} label="Postos Ativos" value={data?.activeStations || 0} color="yellow" />
            <StatCard icon={<Plug />} label="Carregadores Online" value={data?.onlineChargers || 0} color="red" live />
            <StatCard icon={<Activity />} label="Sessoes Totais" value={data?.totalSessions || 0} color="indigo" live />
          </div>

          {chart && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                <h3 className="text-sm font-medium text-white mb-4">Receita Mensal (R$)</h3>
                <BarChart
                  labels={chart.labels}
                  datasets={[{ label: 'Receita', data: chart.revenue, color: '#10b981' }]}
                />
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                <h3 className="text-sm font-medium text-white mb-4">Sessoes por Mes</h3>
                <LineChart
                  labels={chart.labels}
                  datasets={[{ label: 'Sessoes', data: chart.sessions, color: '#3b82f6' }]}
                />
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 lg:col-span-2">
                <h3 className="text-sm font-medium text-white mb-4">Energia Consumida (kWh)</h3>
                <BarChart
                  labels={chart.labels}
                  datasets={[{ label: 'Energia', data: chart.energy, color: '#f59e0b' }]}
                  height={200}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<Wallet />} label="Receita" value={`R$ ${Number(data?.revenue || 0).toFixed(2)}`} color="emerald" live />
            <StatCard icon={<Activity />} label="Sessoes" value={data?.sessions || 0} color="blue" live />
            <StatCard icon={<Zap />} label="Energia Consumida" value={`${Number(data?.energy || 0).toFixed(0)} kWh`} color="yellow" live />
            <StatCard icon={<Plug />} label="Carregadores Ativos" value={data?.activeChargers || 0} color="green" live />
            <StatCard icon={<Wallet />} label="Saldo Disponivel" value={`R$ ${Number(data?.balance || 0).toFixed(2)}`} color="purple" />
          </div>

          {chart && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                <h3 className="text-sm font-medium text-white mb-4">Receita Mensal (R$)</h3>
                <BarChart
                  labels={chart.labels}
                  datasets={[{ label: 'Receita', data: chart.revenue, color: '#10b981' }]}
                />
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                <h3 className="text-sm font-medium text-white mb-4">Sessoes por Mes</h3>
                <LineChart
                  labels={chart.labels}
                  datasets={[{ label: 'Sessoes', data: chart.sessions, color: '#3b82f6' }]}
                />
              </div>
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 lg:col-span-2">
                <h3 className="text-sm font-medium text-white mb-4">Energia Consumida (kWh)</h3>
                <BarChart
                  labels={chart.labels}
                  datasets={[{ label: 'Energia', data: chart.energy, color: '#f59e0b' }]}
                  height={200}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, live }: { icon: React.ReactNode; label: string; value: string | number; color: string; live?: boolean }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <div className={`rounded-xl border p-5 transition-all duration-300 ${colors[color] || colors.emerald}`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
        {live && (
          <span className="flex items-center gap-1 text-[10px] font-mono opacity-70">
            <Radio size={10} className="animate-pulse" />
            tempo real
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div className="h-8 w-40 bg-slate-800 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-5 animate-pulse">
            <div className="h-4 w-24 bg-slate-800 rounded mb-3" />
            <div className="h-8 w-32 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
