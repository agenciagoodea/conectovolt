'use client';

import Link from 'next/link';
import { Zap, MapPin, Shield, Smartphone, CreditCard, BarChart3, ChevronRight, Check } from 'lucide-react';

const features = [
  {
    icon: <MapPin size={24} />,
    title: 'Rede Nacional de Postos',
    description: 'Encontre postos de recarga proximos com busca por geolocalizacao e filtros por tipo de conector.',
  },
  {
    icon: <CreditCard size={24} />,
    title: 'Pagamento Facil',
    description: 'Pague com PIX ou cartao de credito diretamente pelo app. Comprovante automatico a cada recarga.',
  },
  {
    icon: <Smartphone size={24} />,
    title: 'App Mobile Completo',
    description: 'Acompanhe suas recargas em tempo real, veja historico e gerencie seu veiculo no celular.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Seguranca e Confiabilidade',
    description: 'Plataforma com monitoramento 24/7, alertas automaticos e manutencao preventiva dos equipamentos.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Dashboard para Operadores',
    description: 'Painel completo para gerenciar postos, carregadores, financeiro e relatorios em tempo real.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Carregamento Rapido',
    description: 'Suporte a carregadores DC de alta potencia (CCS, CHAdeMO) com energia limpa e renovavel.',
  },
];

const plans = [
  {
    name: 'Basico',
    price: 'Gratuito',
    description: 'Para motoristas que recargam ocasionalmente',
    features: [
      'Busca de postos',
      'Pagamento por recarga',
      'Historico de recargas',
      'Suporte por email',
    ],
  },
  {
    name: 'Operador',
    price: 'A partir de R$ 99/mes',
    description: 'Para gestores de postos de recarga',
    features: [
      'Gerenciamento de postos',
      'Dashboard financeiro',
      'Relatorios detalhados',
      'Suporte prioritario',
      'Multi-usuarios',
      'API de integracao',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    description: 'Para grandes frotas e redes de postos',
    features: [
      'Tudo do plano Operador',
      'SLA dedicado',
      'Integracao OCPP',
      'Gerente de conta',
      'Customizacao completa',
      'White-label',
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Zap className="text-emerald-400" size={20} />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">ConectoVolt</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Comecar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <Zap size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Plataforma de Gestao para Postos de Recarga</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Recarga de Veiculos Eletricos
              <span className="text-emerald-400"> Simplificada</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Encontre, acesse e pague suas recagas em qualquer posto da nossa rede. 
              Gestao completa para operadores e experiencia impecavel para motoristas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
              >
                Criar Conta Gratis <ChevronRight size={18} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all"
              >
                Sou Operador
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tudo que voce precisa</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Uma plataforma completa para motoristas e operadores de postos de recarga.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-slate-400 text-lg">Simples, rapido e seguro</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Encontre um Posto', description: 'Use o mapa para encontrar o posto de recarga mais proximo com disponibilidade.' },
              { step: '02', title: 'Conecte e Recarregue', description: 'Plugue seu veiculo e inicie a recarga. Acompanhe em tempo real pelo app.' },
              { step: '03', title: 'Pague Facil', description: 'Apos a recarga, pague com PIX ou cartao. Receba o comprovante automaticamente.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Planos e Precos</h2>
            <p className="text-slate-400 text-lg">Escolha o plano ideal para voce ou sua empresa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border ${
                  plan.highlighted
                    ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 inline-block mb-4">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-2xl font-bold text-emerald-400 mb-2">{plan.price}</p>
                <p className="text-sm text-slate-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={16} className="text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  Comecar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pronto para comecar?</h2>
          <p className="text-slate-400 text-lg mb-8">
            Cadastre-se gratuitamente e comece a usar a plataforma hoje mesmo.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            Criar Minha Conta <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="text-emerald-400" size={18} />
              <span className="text-sm font-semibold text-white">ConectoVolt</span>
            </div>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} ConectoVolt. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
