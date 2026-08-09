import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { getJwtSecret } from '../../../common/utils/config.utils';

export interface ChargingSessionUpdate {
  sessionId: string;
  userId: string;
  chargerId: string;
  status: string;
  energyKwh: number;
  amount?: number;
  startTime: Date;
  endTime?: Date;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

@WebSocketGateway({
  namespace: '/charging',
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
})
export class ChargingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChargingGateway.name);

  constructor(private readonly configService: ConfigService) {}

  handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        (client.handshake.auth?.token as string | undefined) ||
        (client.handshake.query?.token as string | undefined);
      if (!token || typeof token !== 'string') {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      const secret = getJwtSecret(this.configService);
      const payload = jwt.verify(token, secret) as {
        sub: string;
        email: string;
      };

      client.userId = payload.sub;
      client.userEmail = payload.email;

      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch {
      this.logger.warn(`Client ${client.id} invalid token`);
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe:session')
  handleSubscribeSession(client: AuthenticatedSocket, sessionId: string) {
    if (!client.userId) return;
    void client.join(`session:${sessionId}`);
    return { event: 'subscribed', data: { sessionId } };
  }

  @SubscribeMessage('subscribe:user')
  handleSubscribeUser(client: AuthenticatedSocket, userId: string) {
    if (!client.userId) return;
    if (userId !== client.userId) {
      client.emit('error', { message: 'Not authorized' });
      return;
    }
    void client.join(`user:${userId}`);
    return { event: 'subscribed', data: { userId } };
  }

  @SubscribeMessage('unsubscribe:session')
  handleUnsubscribeSession(client: AuthenticatedSocket, sessionId: string) {
    void client.leave(`session:${sessionId}`);
    return { event: 'unsubscribed', data: { sessionId } };
  }

  emitSessionUpdate(update: ChargingSessionUpdate) {
    this.server
      .to(`session:${update.sessionId}`)
      .emit('session:update', update);
    this.server.to(`user:${update.userId}`).emit('session:update', update);
  }

  emitSessionStarted(update: ChargingSessionUpdate) {
    this.server.to(`user:${update.userId}`).emit('session:started', update);
  }

  emitSessionCompleted(update: ChargingSessionUpdate) {
    this.server
      .to(`session:${update.sessionId}`)
      .emit('session:completed', update);
    this.server.to(`user:${update.userId}`).emit('session:completed', update);
  }
}
