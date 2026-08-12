'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { CreditCard, Check, Star } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  maxStations: number;
  maxChargers: number;
  maxUsers: number;
  isActive: boolean;
}

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate?: string;
  plan: Plan;
}

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [{ data: plansData }, { data: subData }] = await Promise.all([
        api.get('/billing/plans'),
        api.get('/billing/subscription'),
      ]);
      setPlans(plansData);
      if (subData) setSubscription(subData);
    } catch {
      setError('Erro ao carregar planos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubscribe = useCallback(
    async (planId: string) => {
      setSubscribing(planId);
      try {
        await api.post('/billing/subscribe', { planId });
        await load();
      } finally {
        setSubscribing(null);
      }
    },
    [load],
  );

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-slate-800 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-6 animate-pulse">
              <div className="h-6 w-24 bg-slate-800 rounded mb-4" />
              <div className="h-10 w-20 bg-slate-800 rounded mb-4" />
              <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
              <div className="h-10 w-full bg-slate-800 rounded mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <CreditCard size={24} className="text-emerald-400" /> Planos e Assinaturas
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400">
          {error}
          <button onClick={() => void load()} className="ml-3 underline hover:text-red-300">Tentar novamente</button>
        </div>
      )}

      {subscription && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-3">
            <Star className="text-emerald-400" size={20} />
            <div>
              <p className="text-white font-medium">Plano Atual: {subscription.plan.name}</p>
              <p className="text-sm text-slate-400">
                R$ {Number(subscription.plan.price).toFixed(2)}/mes — 
                {subscription.plan.maxStations} postos, {subscription.plan.maxChargers} carregadores, {subscription.plan.maxUsers} usuarios
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-slate-900 rounded-xl border p-6 transition-colors ${subscription?.plan?.id === plan.id ? 'border-emerald-500/50 ring-1 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">{plan.name}</h3>
              {subscription?.plan?.id === plan.id && <Check className="text-emerald-400" size={20} />}
            </div>
            <p className="text-3xl font-bold text-white mb-1">R$ {Number(plan.price).toFixed(0)}<span className="text-sm text-slate-400 font-normal">/mes</span></p>
            <p className="text-sm text-slate-400 mb-4">{plan.description || ''}</p>
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-slate-300"><span>Postos</span><span className="text-white">{plan.maxStations}</span></div>
              <div className="flex justify-between text-slate-300"><span>Carregadores</span><span className="text-white">{plan.maxChargers}</span></div>
              <div className="flex justify-between text-slate-300"><span>Usuarios</span><span className="text-white">{plan.maxUsers}</span></div>
            </div>
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={subscription?.plan?.id === plan.id || subscribing === plan.id}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                subscription?.plan?.id === plan.id
                  ? 'bg-emerald-600/50 text-emerald-300 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
              }`}
            >
              {subscribing === plan.id ? 'Assinando...' : subscription?.plan?.id === plan.id ? 'Plano Atual' : 'Assinar'}
            </button>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12 text-slate-500">Nenhum plano disponivel</div>
      )}
    </div>
  );
}
