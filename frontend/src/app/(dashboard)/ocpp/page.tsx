'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Zap, Copy, Code } from 'lucide-react';

interface Charger {
  id: string;
  serialNumber: string;
  ocppId?: string;
  status: string;
}

export default function OcppInfoPage() {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { data } = await api.get('/chargers');
      setChargers(data);
    } catch {
      setError('Erro ao carregar carregadores. Tente novamente.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      setWsUrl(`${proto}//${window.location.host}`);
    }
  }, []);

  const fullUrl = wsUrl ? `${wsUrl}/ocpp` : 'wss://conectovolt.com.br/ocpp';

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Zap size={24} className="text-emerald-400" /> Conexao OCPP
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Code size={18} className="text-blue-400" /> Configuracao do Carregador
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-2">Configure seu carregador fisico com estas informacoes:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Protocolo:</span>
                  <span className="text-white font-mono">OCPP 1.6J (JSON)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Endereco WebSocket (URL Central):</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono text-xs">{fullUrl}</span>
                    <button onClick={() => navigator.clipboard.writeText(fullUrl)} className="text-emerald-400 hover:text-emerald-300" aria-label="Copiar URL">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">URL Completa do Backend:</span>
                  <span className="text-white font-mono text-xs">{wsUrl ? `${wsUrl}/ocpp/[OCPP_ID]` : 'wss://.../ocpp/[OCPP_ID]'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Identificador (Charge Point ID):</span>
                  <span className="text-white">OCPP ID cadastrado (ex: SP-001)</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <p className="text-sm text-emerald-300 font-medium mb-2">Como conectar:</p>
              <ol className="text-sm text-slate-300 space-y-1 list-decimal pl-4">
                <li>Acesse o painel de configuracao do seu carregador fisico</li>
                <li>Localize as configuracoes de OCPP / Backend</li>
                <li>Insira a URL WebSocket acima</li>
                <li>Configure o identificador (OCPP ID) igual ao cadastrado no sistema</li>
                <li>Salve e reinicie o carregador</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white font-medium mb-4">Carregadores Cadastrados</h3>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">
              {error}
              <button onClick={() => void load()} className="ml-3 underline hover:text-red-300">Tentar novamente</button>
            </div>
          )}
          {chargers.length === 0 ? (
            <div className="text-center py-8">
              <Zap size={40} className="mx-auto mb-3 text-slate-600" />
              <p className="text-slate-500 text-sm mb-4">Nenhum carregador cadastrado ainda</p>
              <p className="text-xs text-slate-600">
                Cadastre um carregador na pagina Carregadores e configure o OCPP ID para conectar.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {chargers.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
                  <div>
                    <span className="text-white text-sm">{c.serialNumber}</span>
                    <p className="text-xs text-slate-500">OCPP ID: {c.ocppId || 'Nao definido'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${c.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    {c.status === 'ONLINE' ? 'Conectado' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
