import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar minhas notificacoes' })
  findMyNotifications(
    @CurrentUser('id') userId: string,
    @Query('unread') unreadOnly?: string,
  ) {
    return this.notificationsService.findByUser(userId, unreadOnly === 'true');
  }

  @Get('count')
  @ApiOperation({ summary: 'Contar notificacoes nao lidas' })
  getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificacao como lida' })
  markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Marcar todas como lidas' })
  markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Post('broadcast')
  @Roles('SUPER_ADMIN')
  @ApiOperation({
    summary: 'Enviar notificacao para todos usuarios de um perfil',
  })
  broadcast(
    @Query('role') role: string,
    @Query('title') title: string,
    @Query('message') message: string,
  ) {
    return this.notificationsService.broadcastToRole(role, title, message);
  }
}
