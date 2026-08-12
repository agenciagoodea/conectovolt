'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth';

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api/v1', '') || '';

interface SessionEvent {
  sessionId: string;
  userId: string;
  chargerId: string;
  status: string;
  energyKwh: number;
  amount?: number;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: number;
}

export function useSocketNotifications() {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set());

  const addNotification = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).slice(2);
    const key = `${type}:${message}`;
    if (notifiedRef.current.has(key)) return;
    notifiedRef.current.add(key);
    setNotifications((prev) => [{ id, message, type, timestamp: Date.now() }, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      notifiedRef.current.delete(key);
    }, 6000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (!user) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;

    const socket = io(`${SOCKET_URL}/charging`, {
      transports: ['websocket'],
      autoConnect: true,
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('subscribe:user', user.id);
    });

    socket.on('session:started', (data: SessionEvent) => {
      if (data.userId === user.id) {
        addNotification(`Sessao de recarga iniciada! Energia: ${Number(data.energyKwh).toFixed(1)} kWh`, 'success');
      }
    });

    socket.on('session:completed', (data: SessionEvent) => {
      if (data.userId === user.id) {
        addNotification(`Recarga finalizada! Total: ${Number(data.energyKwh).toFixed(1)} kWh - R$ ${Number(data.amount || 0).toFixed(2)}`, 'success');
      }
    });

    socket.on('session:update', (data: SessionEvent) => {
      if (data.userId === user.id) {
        addNotification(`Atualizacao: ${Number(data.energyKwh).toFixed(1)} kWh - R$ ${Number(data.amount || 0).toFixed(2)}`, 'info');
      }
    });

    socket.on('disconnect', () => {});

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, addNotification]);

  return { notifications, dismiss };
}
