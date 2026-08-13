import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import WebSocket, { WebSocketServer, RawData } from 'ws';
import { IncomingMessage } from 'http';
import { OcppService } from './ocpp.service';
import { OcppCallResult } from './ocpp.types';

type OcppMessage = [number, string, ...unknown[]];

@Injectable()
export class OcppServer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OcppServer.name);
  private wss: WebSocketServer | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly ocppService: OcppService,
  ) {}

  onModuleInit() {
    try {
      if (process.env.ENABLE_OCPP_PORT === 'true') {
        const port = this.configService.get<number>('OCPP_PORT') || 3001;
        const host = this.configService.get<string>('OCPP_HOST') || '0.0.0.0';
        this.wss = new WebSocketServer({ port, host });

        this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
          if (!this.isAuthorized(req)) {
            this.logger.warn('Rejected unauthenticated OCPP connection');
            ws.close(1008, 'Authentication required');
            return;
          }

          const ocppId = this.extractOcppId(req);
          this.logger.log(`OCPP charger connected: ${ocppId}`);

          this.ocppService.trackConnection(ocppId, ws);

          (ws as any).isAlive = true;

          ws.on('message', (data: RawData) => {
            void this.handleMessage(ocppId, ws, data);
          });

          ws.on('close', () => {
            this.logger.log(`OCPP charger disconnected: ${ocppId}`);
            this.ocppService.removeConnection(ocppId);
          });

          ws.on('error', (error: Error) => {
            this.logger.error(
              `WebSocket error for ${ocppId}: ${error.message}`,
            );
          });

          ws.on('pong', () => {
            (ws as any).isAlive = true;
          });
        });

        this.logger.log(`OCPP WebSocket server listening on ${host}:${port}`);

        this.pingInterval = setInterval(() => {
          this.wss?.clients.forEach((ws) => {
            if ((ws as any).isAlive === false) {
              this.logger.warn(`Terminating unresponsive WebSocket`);
              return ws.terminate();
            }
            (ws as any).isAlive = false;
            ws.ping();
          });
        }, 30000);
      } else {
        this.logger.log(
          'OCPP standalone port disabled for Passenger environment',
        );
      }
    } catch (error) {
      const err = error as { message?: string };
      this.logger.error(
        `Failed to start OCPP WebSocket server: ${err.message ?? 'unknown error'}`,
      );
    }
  }

  onModuleDestroy() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    if (this.wss) {
      this.wss.close();
      this.logger.log('OCPP WebSocket server closed');
    }
  }

  private extractOcppId(req: IncomingMessage): string {
    const url = req.url || '';
    const match = url.match(/[?&]identifier=([^&]+)/);
    if (match) return match[1];

    const path = url.split('?')[0];
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
      return pathParts[pathParts.length - 1];
    }

    return `charger-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private isAuthorized(req: IncomingMessage) {
    const expectedToken = this.configService.get<string>('OCPP_SHARED_TOKEN');
    if (!expectedToken) {
      this.logger.error(
        'OCPP_SHARED_TOKEN is not configured; refusing OCPP connections',
      );
      return false;
    }

    const header = req.headers['x-ocpp-token'] || req.headers.authorization;
    const value = Array.isArray(header) ? header[0] : header;

    let receivedToken = value || '';

    if (receivedToken.startsWith('Bearer ')) {
      receivedToken = receivedToken.slice('Bearer '.length);
    } else if (receivedToken.startsWith('Basic ')) {
      try {
        const credentials = Buffer.from(
          receivedToken.slice('Basic '.length),
          'base64',
        ).toString('utf8');
        receivedToken = credentials.slice(credentials.indexOf(':') + 1);
      } catch {
        return false;
      }
    }

    if (receivedToken && receivedToken === expectedToken) return true;

    const url = req.url || '';
    const tokenMatch = url.match(/[?&](?:token|X-OCPP-Token)=([^&]+)/i);
    if (tokenMatch) {
      return tokenMatch[1] === expectedToken;
    }

    return false;
  }

  private async handleMessage(ocppId: string, ws: WebSocket, data: RawData) {
    try {
      const raw =
        typeof data === 'string'
          ? data
          : Buffer.isBuffer(data)
            ? data.toString('utf-8')
            : new TextDecoder().decode(new Uint8Array(data as ArrayBuffer));
      const message = JSON.parse(raw) as unknown;

      if (!Array.isArray(message) || message.length < 3) {
        this.sendError(
          ws,
          '',
          'FormationViolation',
          'Invalid OCPP message format',
          {},
        );
        return;
      }

      const typed = message as OcppMessage;
      const messageTypeId = typed[0];
      const uniqueId = typed[1];

      if (messageTypeId === 2) {
        const action = typed[2] as string;
        const payload = (typed[3] ?? {}) as Record<string, unknown>;

        await this.processCall(ocppId, ws, uniqueId, action, payload);
      } else if (messageTypeId === 3) {
        const payload = (typed[2] ?? {}) as Record<string, unknown>;
        this.logger.log(`CALLRESULT from ${ocppId} for ${uniqueId}: ${JSON.stringify(payload)}`);
      } else if (messageTypeId === 4) {
        const errorCode = typed[2] as string;
        const errorDescription = typed[3] as string;
        this.logger.warn(`CALLERROR from ${ocppId} for ${uniqueId}: ${errorCode} - ${errorDescription}`);
      }
    } catch (error) {
      const err = error as { message?: string };
      const msg = err.message ?? 'unknown error';
      this.logger.error(`Error processing OCPP message: ${msg}`);
      this.sendError(ws, '', 'InternalError', msg, {});
    }
  }

  private async processCall(
    ocppId: string,
    ws: WebSocket,
    uniqueId: string,
    action: string,
    payload: Record<string, unknown>,
  ) {
    try {
      let result: Record<string, unknown>;

      switch (action) {
        case 'BootNotification':
          result = await this.ocppService.handleBootNotification(
            ocppId,
            payload,
          );
          break;
        case 'Heartbeat':
          result = await this.ocppService.handleHeartbeat(ocppId);
          break;
        case 'Authorize':
          result = await this.ocppService.handleAuthorize(ocppId, payload);
          break;
        case 'StatusNotification':
          result = await this.ocppService.handleStatusNotification(
            ocppId,
            payload,
          );
          break;
        case 'StartTransaction':
          result = await this.ocppService.handleStartTransaction(
            ocppId,
            payload,
          );
          break;
        case 'StopTransaction':
          result = await this.ocppService.handleStopTransaction(
            ocppId,
            payload,
          );
          break;
        case 'MeterValues':
          result = await this.ocppService.handleMeterValues(ocppId, payload);
          break;
        case 'DataTransfer':
          result = this.ocppService.handleDataTransfer(ocppId, payload);
          break;
        case 'DiagnosticsStatusNotification':
          result = this.ocppService.handleDiagnosticsStatusNotification(
            ocppId,
            payload,
          );
          break;
        case 'FirmwareStatusNotification':
          result = this.ocppService.handleFirmwareStatusNotification(
            ocppId,
            payload,
          );
          break;
        case 'TriggerMessage':
          result = { status: 'Accepted' };
          break;
        case 'ClearCache':
          result = { status: 'Accepted' };
          break;
        case 'GetConfiguration':
          result = this.ocppService.handleGetConfiguration(ocppId, payload);
          break;
        case 'ChangeConfiguration':
          result = this.ocppService.handleChangeConfiguration(ocppId, payload);
          break;
        case 'GetLocalListVersion':
          result = { listVersion: 1 };
          break;
        default:
          this.logger.warn(`Unsupported OCPP action: ${action}`);
          this.sendError(
            ws,
            uniqueId,
            'NotSupported',
            `Action ${action} not supported`,
            {},
          );
          return;
      }

      this.sendResult(ws, uniqueId, result);
      if (action === 'BootNotification' && result.status === 'Rejected') {
        this.ocppService.removeConnection(ocppId);
        ws.close(1008, 'Unknown charger');
      }
    } catch (error) {
      const err = error as { message?: string };
      const msg = err.message ?? 'unknown error';
      this.logger.error(`Error processing action ${action}: ${msg}`);
      this.sendError(ws, uniqueId, 'InternalError', msg, {});
    }
  }

  sendRemoteStartTransaction(
    ocppId: string,
    idTag: string,
    connectorId?: number,
  ) {
    return this.sendCall(ocppId, 'RemoteStartTransaction', {
      connectorId,
      idTag,
    });
  }

  sendRemoteStopTransaction(ocppId: string, transactionId: number) {
    return this.sendCall(ocppId, 'RemoteStopTransaction', { transactionId });
  }

  sendUnlockConnector(ocppId: string, connectorId: number) {
    return this.sendCall(ocppId, 'UnlockConnector', { connectorId });
  }

  sendReset(ocppId: string, type: 'Hard' | 'Soft' = 'Soft') {
    return this.sendCall(ocppId, 'Reset', { type });
  }

  sendChangeConfiguration(ocppId: string, key: string, value: string) {
    return this.sendCall(ocppId, 'ChangeConfiguration', { key, value });
  }

  sendGetConfiguration(ocppId: string, keys?: string[]) {
    return this.sendCall(ocppId, 'GetConfiguration', keys ? { key: keys } : {});
  }

  private sendCall(
    ocppId: string,
    action: string,
    payload: Record<string, unknown>,
  ) {
    const ws = this.ocppService.getConnection(ocppId);
    if (!ws || ws.readyState !== 1) {
      this.logger.warn(
        `Cannot send ${action}: charger ${ocppId} not connected`,
      );
      return false;
    }
    const uniqueId = `${action}-${Date.now()}`;
    const message: OcppMessage = [2, uniqueId, action, payload];
    ws.send(JSON.stringify(message));
    this.logger.log(`Sent ${action} to ${ocppId}`);
    return true;
  }

  private sendResult(
    ws: WebSocket,
    uniqueId: string,
    payload: Record<string, unknown>,
  ) {
    const response = [3, uniqueId, payload] as unknown as OcppCallResult;
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(response));
    }
  }

  private sendError(
    ws: WebSocket,
    uniqueId: string,
    errorCode: string,
    errorDescription: string,
    errorDetails: Record<string, unknown>,
  ) {
    const response = [4, uniqueId, errorCode, errorDescription, errorDetails];
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(response));
    }
  }
}
