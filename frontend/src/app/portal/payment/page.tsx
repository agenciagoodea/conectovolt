'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { ArrowLeft, CheckCircle2, Copy, Loader2, QrCode } from 'lucide-react';

interface Payment {
  id: string;
  status: string;
  amount: number;
}

interface GatewayData {
  qrCode?: string;
  qrCodeBase64?: string;
  copyPaste?: string;
}

export default function PaymentPage() {
  const [sessionId, setSessionId] = useState('');
  const [amount, setAmount] = useState(0);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [gateway, setGateway] = useState<GatewayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get('session') || '');
    setAmount(Number(params.get('amount') || 0));
  }, []);

  const createPayment = useCallback(async () => {
    if (!sessionId) {
      setError('Sessao de recarga nao informada.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/payments', { sessionId, gateway: 'PIX' });
      setPayment(data.payment);
      setGateway(data.gateway);
      setAmount(Number(data.payment?.amount || 0));
    } catch {
      setError('Nao foi possivel criar o pagamento PIX.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) void createPayment();
  }, [createPayment, sessionId]);

  const refreshPayment = useCallback(async () => {
    if (!payment?.id || payment.status === 'APPROVED') return;
    try {
      const { data } = await api.get(`/payments/${payment.id}`);
      setPayment(data);
    } catch {
      setError('Nao foi possivel consultar o status do pagamento.');
    }
  }, [payment]);

  useEffect(() => {
    if (!payment || payment.status === 'APPROVED') return;
    const timer = window.setInterval(() => void refreshPayment(), 5000);
    return () => window.clearInterval(timer);
  }, [payment, refreshPayment]);

  async function copyCode() {
    if (!gateway?.copyPaste) return;
    await navigator.clipboard.writeText(gateway.copyPaste);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-400" /></div>;

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/portal/history" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> Historico</Link>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
        <p className="text-sm text-slate-400">Pagamento da recarga</p>
        <p className="mt-2 text-3xl font-bold text-white">R$ {amount.toFixed(2)}</p>
        {error && <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
        {payment?.status === 'APPROVED' ? (
          <div className="mt-8"><CheckCircle2 className="mx-auto text-emerald-400" size={54} /><p className="mt-3 font-medium text-white">Pagamento confirmado</p><p className="mt-1 text-sm text-slate-400">Seu comprovante foi registrado no historico.</p><Link href="/portal/history" className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white">Ver historico</Link></div>
        ) : gateway ? (
          <div className="mt-8">
            <QrCode className="mx-auto text-emerald-400" size={40} />
            <p className="mt-3 text-sm text-slate-300">Escaneie o QR Code ou copie o codigo PIX.</p>
            {gateway.qrCodeBase64 ? <Image unoptimized width={208} height={208} className="mx-auto mt-5 h-52 w-52 rounded-lg bg-white p-3" alt="QR Code PIX" src={`data:image/png;base64,${gateway.qrCodeBase64}`} /> : <div className="mx-auto mt-5 flex h-52 w-52 items-center justify-center rounded-lg border border-dashed border-slate-700 text-xs text-slate-500">QR Code disponivel no gateway</div>}
            {gateway.copyPaste && <><p className="mt-5 break-all rounded-lg bg-slate-800 p-3 text-left font-mono text-xs text-slate-300">{gateway.copyPaste}</p><button onClick={() => void copyCode()} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 px-4 py-2 text-sm text-emerald-400"> <Copy size={15} /> {copied ? 'Codigo copiado' : 'Copiar codigo PIX'}</button></>}
            <p className="mt-6 text-xs text-slate-500">Aguardando confirmacao automatica do gateway...</p>
          </div>
        ) : <button onClick={() => void createPayment()} className="mt-8 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white">Tentar novamente</button>}
      </div>
    </div>
  );
}
