import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
  }) {
    return this.prisma.notification.create({ data });
  }

  async findByUser(userId: string, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  // Send notification to all users with a given role
  async broadcastToRole(
    role: string,
    title: string,
    message: string,
    type = 'system',
  ) {
    const users = await this.prisma.user.findMany({
      where: { role },
      select: { id: true },
    });
    const results: Record<string, unknown>[] = [];
    for (const u of users) {
      results.push(await this.create({ userId: u.id, type, title, message }));
    }
    this.logger.log(
      `Broadcast ${type} notification to ${users.length} ${role} users`,
    );
    return results;
  }
}
