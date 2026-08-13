import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { PrismaService } from '../../database/prisma.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
  ForgotPasswordDto,
} from './dto/auth.dto';
import {
  hashPassword,
  comparePassword,
} from '../../common/utils/password.utils';
import {
  getJwtSecret,
  getJwtRefreshSecret,
} from '../../common/utils/config.utils';

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

    const verifyToken = this.jwtService.sign(
      { sub: dto.email, type: 'email_verify' },
      { expiresIn: '24h' as const },
    );

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        role: 'CUSTOMER',
        verifyToken,
      },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);

    this.logger.log(`User registered: ${user.email}`);

    try {
      await this.sendVerificationEmail(user.email, verifyToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Verification email failed: ${message}`);
    }

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

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token) as unknown;
      const payload = decoded as { sub: string; type?: string };

      if (payload.type !== 'email_verify') {
        throw new BadRequestException('Invalid verification token');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: payload.sub },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.emailVerified) {
        return { message: 'Email already verified' };
      }

      await this.prisma.user.update({
        where: { email: payload.sub },
        data: { emailVerified: true, verifyToken: null },
      });

      return { message: 'Email verified successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'If the email exists, a verification link has been sent' };
    }

    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }

    const verifyToken = this.jwtService.sign(
      { sub: user.email, type: 'email_verify' },
      { expiresIn: '24h' as const },
    );

    await this.prisma.user.update({
      where: { email },
      data: { verifyToken },
    });

    try {
      await this.sendVerificationEmail(email, verifyToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Verification email failed: ${message}`);
    }

    return { message: 'If the email exists, a verification link has been sent' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);

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
      const decoded = this.jwtService.verify(dto.refresh_token, {
        secret: getJwtRefreshSecret(this.configService),
      }) as unknown;
      const payload = decoded as { sub: string };

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = this.generateTokens(user.id, user.email, user.role);

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
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    dto: { name?: string; phone?: string; avatarUrl?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updateData: { name?: string; phone?: string; avatarUrl?: string } = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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
        secret: getJwtSecret(this.configService),
        expiresIn: '1h' as const,
      },
    );

    try {
      await this.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Password reset email failed: ${message}`);
    }

    return {
      message: 'If the email exists, a reset link has been sent',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const decoded = this.jwtService.verify(dto.token, {
        secret: getJwtSecret(this.configService),
      }) as unknown;
      const payload = decoded as { sub: string; type?: string };

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

  private generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: getJwtRefreshSecret(this.configService),
      expiresIn: '7d' as const,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    const host = this.configService.get<string>('SMTP_HOST');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      this.logger.warn('Password reset email skipped: SMTP is not configured');
      return;
    }

    const port = Number(this.configService.get<string>('SMTP_PORT') || 465);
    const secure = this.configService.get<string>('SMTP_SECURE') !== 'false';
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM') || user,
      to: email,
      subject: 'Redefinicao de senha ConectoVolt',
      text: `Acesse ${frontendUrl}/reset-password?token=${encodeURIComponent(token)} para redefinir sua senha. Este link expira em uma hora.`,
    });
    this.logger.log(`Password reset email sent to ${email}`);
  }

  private async sendVerificationEmail(email: string, token: string) {
    const host = this.configService.get<string>('SMTP_HOST');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      this.logger.warn('Verification email skipped: SMTP is not configured');
      return;
    }

    const port = Number(this.configService.get<string>('SMTP_PORT') || 465);
    const secure = this.configService.get<string>('SMTP_SECURE') !== 'false';
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM') || user,
      to: email,
      subject: 'Verifique seu email - ConectoVolt',
      text: `Acesse ${frontendUrl}/verify-email?token=${encodeURIComponent(token)} para verificar seu email. Este link expira em 24 horas.`,
    });
    this.logger.log(`Verification email sent to ${email}`);
  }
}
