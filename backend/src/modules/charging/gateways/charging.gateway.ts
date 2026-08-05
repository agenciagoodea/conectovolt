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

@WebSocketGateway({
  namespace: '/charging',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChargingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChargingGateway.name);

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      const secret = process.env.JWT_SECRET || 'conectovolt-jwt-secret-change-in-production';
      const payload = jwt.verify(token, secret) as { sub: string; email: string };

      (client as any).userId = payload.sub;
      (client as any).userEmail = payload.email;

      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch {
      this.logger.warn(`Client ${client.id} invalid token`);
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe:session')
  handleSubscribeSession(client: Socket, sessionId: string) {
    if (!(client as any).userId) return;
    client.join(`session:${sessionId}`);
    return { event: 'subscribed', data: { sessionId } };
  }

  @SubscribeMessage('subscribe:user')
  handleSubscribeUser(client: Socket, userId: string) {
    if (!(client as any).userId) return;
    const authenticatedUserId = (client as any).userId;
    if (userId !== authenticatedUserId) {
      client.emit('error', { message: 'Not authorized' });
      return;
    }
    client.join(`user:${userId}`);
    return { event: 'subscribed', data: { userId } };
  }

  @SubscribeMessage('unsubscribe:session')
  handleUnsubscribeSession(client: Socket, sessionId: string) {
    client.leave(`session:${sessionId}`);
    return { event: 'unsubscribed', data: { sessionId } };
  }

  emitSessionUpdate(update: ChargingSessionUpdate) {
    this.server.to(`session:${update.sessionId}`).emit('session:update', update);
    this.server.to(`user:${update.userId}`).emit('session:update', update);
  }

  emitSessionStarted(update: ChargingSessionUpdate) {
    this.server.to(`user:${update.userId}`).emit('session:started', update);
  }

  emitSessionCompleted(update: ChargingSessionUpdate) {
    this.server.to(`session:${update.sessionId}`).emit('session:completed', update);
    this.server.to(`user:${update.userId}`).emit('session:completed', update);
  }
}
