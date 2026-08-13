'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth';

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api/v1', '') || '';

export interface SessionUpdate {
  sessionId: string;
  userId: string;
  chargerId: string;
  status: string;
  energyKwh: number;
  amount?: number;
  startTime: Date;
  endTime?: Date;
}

export interface ChargerStatusUpdate {
  chargerId: string;
  status: string;
}

export interface ConnectorStatusUpdate {
  chargerId: string;
  connectorId: string;
  status: string;
}

export interface ConnectorTelemetry {
  chargerId: string;
  connectorId: string;
  powerKw: number;
  energyKwh: number;
  voltage: number;
  current: number;
  frequency: number;
  timestamp: number;
}

export function useChargingSocket() {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef<{
    onSessionUpdate?: (data: SessionUpdate) => void;
    onSessionStarted?: (data: SessionUpdate) => void;
    onSessionCompleted?: (data: SessionUpdate) => void;
    onChargerStatus?: (data: ChargerStatusUpdate) => void;
    onConnectorStatus?: (data: ConnectorStatusUpdate) => void;
    onConnectorTelemetry?: (data: ConnectorTelemetry) => void;
  }>({});

  useEffect(() => {
    if (!user) return;

    const socket = io(`${SOCKET_URL}/charging`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 50,
      reconnectionDelay: 2000,
      auth: () => ({
        token: typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '',
      }),
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('subscribe:user', user.id);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', () => {
      setConnected(false);
    });

    socket.on('session:update', (data: SessionUpdate) => {
      if (data.userId === user.id) {
        handlersRef.current.onSessionUpdate?.(data);
      }
    });

    socket.on('session:started', (data: SessionUpdate) => {
      if (data.userId === user.id) {
        handlersRef.current.onSessionStarted?.(data);
      }
    });

    socket.on('session:completed', (data: SessionUpdate) => {
      if (data.userId === user.id) {
        handlersRef.current.onSessionCompleted?.(data);
      }
    });

    socket.on('charger:status', (data: ChargerStatusUpdate) => {
      handlersRef.current.onChargerStatus?.(data);
    });

    socket.on('connector:status', (data: ConnectorStatusUpdate) => {
      handlersRef.current.onConnectorStatus?.(data);
    });

    socket.on('connector:telemetry', (data: ConnectorTelemetry) => {
      handlersRef.current.onConnectorTelemetry?.(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user]);

  const subscribeSession = useCallback((sessionId: string) => {
    socketRef.current?.emit('subscribe:session', sessionId);
  }, []);

  const unsubscribeSession = useCallback((sessionId: string) => {
    socketRef.current?.emit('unsubscribe:session', sessionId);
  }, []);

  const onSessionUpdate = useCallback((handler: (data: SessionUpdate) => void) => {
    handlersRef.current.onSessionUpdate = handler;
  }, []);

  const onSessionStarted = useCallback((handler: (data: SessionUpdate) => void) => {
    handlersRef.current.onSessionStarted = handler;
  }, []);

  const onSessionCompleted = useCallback((handler: (data: SessionUpdate) => void) => {
    handlersRef.current.onSessionCompleted = handler;
  }, []);

  const onChargerStatus = useCallback((handler: (data: ChargerStatusUpdate) => void) => {
    handlersRef.current.onChargerStatus = handler;
  }, []);

  const onConnectorStatus = useCallback((handler: (data: ConnectorStatusUpdate) => void) => {
    handlersRef.current.onConnectorStatus = handler;
  }, []);

  const onConnectorTelemetry = useCallback((handler: (data: ConnectorTelemetry) => void) => {
    handlersRef.current.onConnectorTelemetry = handler;
  }, []);

  return {
    connected,
    subscribeSession,
    unsubscribeSession,
    onSessionUpdate,
    onSessionStarted,
    onSessionCompleted,
    onChargerStatus,
    onConnectorStatus,
    onConnectorTelemetry,
  };
}
