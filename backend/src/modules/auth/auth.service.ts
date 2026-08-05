import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ResetPasswordDto, ForgotPasswordDto } from './dto/auth.dto';
import { hashPassword, comparePassword } from '../../common/utils/password.utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        role: 'CUSTOMER',
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    this.logger.log(`User registered: ${user.email}`);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'conectovolt-refresh-secret-change-in-production',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password_reset' },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h' as const,
      },
    );

    this.logger.log(`Password reset requested for: ${user.email}`);
    this.logger.log(`Reset token: ${resetToken}`);

    return {
      message: 'If the email exists, a reset link has been sent',
      reset_token: resetToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(dto.token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid reset token');
      }

      const passwordHash = await hashPassword(dto.new_password);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });

      return { message: 'Password reset successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'conectovolt-refresh-secret-change-in-production',
      expiresIn: '7d' as const,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
