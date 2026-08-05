import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import WebSocket, { WebSocketServer, RawData } from 'ws';
import { OcppService } from './ocpp.service';
import { OcppCall, OcppCallResult } from './ocpp.types';

@Injectable()
export class OcppServer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OcppServer.name);
  private wss: WebSocketServer | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly ocppService: OcppService,
  ) {}

  onModuleInit() {
    const port = this.configService.get<number>('OCPP_PORT') || 3001;
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const ocppId = this.extractOcppId(req);
      this.logger.log(`OCPP charger connected: ${ocppId}`);

      this.ocppService.trackConnection(ocppId, ws);

      ws.on('message', (data: RawData) => {
        this.handleMessage(ocppId, ws, data);
      });

      ws.on('close', () => {
        this.logger.log(`OCPP charger disconnected: ${ocppId}`);
        this.ocppService.removeConnection(ocppId);
      });

      ws.on('error', (error) => {
        this.logger.error(`WebSocket error for ${ocppId}: ${error.message}`);
      });

      ws.on('pong', () => {
        // Keep-alive
      });
    });

    this.logger.log(`OCPP WebSocket server listening on port ${port}`);
  }

  onModuleDestroy() {
    if (this.wss) {
      this.wss.close();
      this.logger.log('OCPP WebSocket server closed');
    }
  }

  private extractOcppId(req: any): string {
    const url = req.url || '';
    const match = url.match(/[?&]identifier=([^&]+)/);
    if (match) return match[1];

    const pathParts = url.split('/').filter(Boolean);
    if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
      return pathParts[pathParts.length - 1];
    }

    return `charger-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private async handleMessage(ocppId: string, ws: WebSocket, data: WebSocket.Data) {
    try {
      const message = JSON.parse(data.toString()) as any[];

      if (!Array.isArray(message) || message.length < 3) {
        this.sendError(ws, '', 'FormationViolation', 'Invalid OCPP message format', {});
        return;
      }

      const messageTypeId = message[0];
      const uniqueId = message[1];

      if (messageTypeId === 2) {
        const action = message[2];
        const payload = message[3] || {};

        await this.processCall(ocppId, ws, uniqueId, action, payload);
      }
    } catch (error) {
      this.logger.error(`Error processing OCPP message: ${error.message}`);
      this.sendError(ws, '', 'InternalError', error.message, {});
    }
  }

  private async processCall(
    ocppId: string,
    ws: WebSocket,
    uniqueId: string,
    action: string,
    payload: any,
  ) {
    try {
      let result: any;

      switch (action) {
        case 'BootNotification':
          result = await this.ocppService.handleBootNotification(ocppId, payload);
          break;
        case 'Heartbeat':
          result = await this.ocppService.handleHeartbeat(ocppId);
          break;
        case 'StatusNotification':
          result = await this.ocppService.handleStatusNotification(ocppId, payload);
          break;
        case 'StartTransaction':
          result = await this.ocppService.handleStartTransaction(ocppId, payload);
          break;
        case 'StopTransaction':
          result = await this.ocppService.handleStopTransaction(ocppId, payload);
          break;
        case 'Authorize':
          result = { idTagInfo: { status: 'Accepted' } };
          break;
        case 'MeterValues':
          result = {};
          break;
        case 'DataTransfer':
          result = { status: 'Accepted' };
          break;
        case 'DiagnosticsStatusNotification':
        case 'FirmwareStatusNotification':
          result = {};
          break;
        default:
          this.sendError(ws, uniqueId, 'NotSupported', `Action ${action} not supported`, {});
          return;
      }

      this.sendResult(ws, uniqueId, result);
    } catch (error) {
      this.logger.error(`Error processing action ${action}: ${error.message}`);
      this.sendError(ws, uniqueId, 'InternalError', error.message, {});
    }
  }

  private sendResult(ws: WebSocket, uniqueId: string, payload: any) {
    const response: OcppCallResult = [3, uniqueId, payload] as any;
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(response));
    }
  }

  private sendError(
    ws: WebSocket,
    uniqueId: string,
    errorCode: string,
    errorDescription: string,
    errorDetails: any,
  ) {
    const response = [4, uniqueId, errorCode, errorDescription, errorDetails];
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(response));
    }
  }
}
