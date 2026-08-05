import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { mockPrismaService, mockJwtService, mockConfigService } from '../../../../test/helpers/mocks';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = mockPrismaService;
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        name: 'Test User',
        email: 'test@email.com',
        role: 'CUSTOMER',
      });

      const result = await service.register({
        name: 'Test User',
        email: 'test@email.com',
        password: '123456',
      });

      expect(result.user.email).toBe('test@email.com');
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.register({ name: 'Test', email: 'test@email.com', password: '123456' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const passwordHash = await bcrypt.hash('123456', 12);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Test User',
        email: 'test@email.com',
        passwordHash,
        role: 'SUPER_ADMIN',
        companyId: 'company-1',
      });

      const result = await service.login({ email: 'test@email.com', password: '123456' });

      expect(result.user.email).toBe('test@email.com');
      expect(result.user.role).toBe('SUPER_ADMIN');
      expect(result.access_token).toBeDefined();
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const passwordHash = await bcrypt.hash('123456', 12);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@email.com',
        passwordHash,
        role: 'CUSTOMER',
      });

      await expect(
        service.login({ email: 'test@email.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@email.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'user-1', email: 'test@email.com', role: 'CUSTOMER' });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'test@email.com', role: 'CUSTOMER' });

      const result = await service.refreshToken({ refresh_token: 'valid-refresh-token' });

      expect(result.access_token).toBeDefined();
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('Invalid token'); });

      await expect(
        service.refreshToken({ refresh_token: 'invalid' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should return success message when email exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'test@email.com' });

      const result = await service.forgotPassword({ email: 'test@email.com' });

      expect(result.message).toContain('sent');
      expect(result.reset_token).toBeDefined();
    });

    it('should still return success when email does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword({ email: 'nonexistent@email.com' });

      expect(result.message).toContain('sent');
      expect(result.reset_token).toBeUndefined();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'user-1', type: 'password_reset' });
      prisma.user.update.mockResolvedValue({ id: 'user-1' });

      const result = await service.resetPassword({ token: 'valid', new_password: 'newpass123' });

      expect(result.message).toContain('reset');
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException with invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('Invalid'); });

      await expect(
        service.resetPassword({ token: 'invalid', new_password: 'newpass' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
