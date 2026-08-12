'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Zap, Car, MapPin, History, ArrowRight } from 'lucide-react';

export default function PortalHome() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ola, {user?.name?.split(' ')[0] || 'Motorista'}</h1>
        <p className="text-slate-400 mt-1">Pronto para recarregar seu veiculo?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/portal/stations" className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3"><MapPin className="text-emerald-400" size={24} /></div>
            <ArrowRight className="text-slate-600 group-hover:text-emerald-400 transition-colors" size={20} />
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">Encontrar Posto</h3>
          <p className="text-slate-400 text-sm">Veja os postos disponiveis e inicie uma recarga</p>
        </Link>
        <Link href="/portal/vehicles" className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3"><Car className="text-blue-400" size={24} /></div>
            <ArrowRight className="text-slate-600 group-hover:text-emerald-400 transition-colors" size={20} />
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">Meus Veiculos</h3>
          <p className="text-slate-400 text-sm">Cadastre e gerencie seus veiculos eletricos</p>
        </Link>
        <Link href="/portal/history" className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3"><History className="text-purple-400" size={24} /></div>
            <ArrowRight className="text-slate-600 group-hover:text-emerald-400 transition-colors" size={20} />
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">Historico</h3>
          <p className="text-slate-400 text-sm">Consulte suas recargas anteriores e gastos</p>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Zap className="text-emerald-400" size={20} /> Como funciona</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">1</div>
            <div><p className="text-white text-sm font-medium">Encontre um posto</p><p className="text-slate-400 text-xs mt-0.5">Escolha o posto de recarga mais proximo</p></div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">2</div>
            <div><p className="text-white text-sm font-medium">Conecte o veiculo</p><p className="text-slate-400 text-xs mt-0.5">Plugue o cabo e inicie a recarga pelo app</p></div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">3</div>
            <div><p className="text-white text-sm font-medium">Acompanhe e pague</p><p className="text-slate-400 text-xs mt-0.5">Veja o progresso e pague pelo aplicativo</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
