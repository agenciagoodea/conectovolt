import { ConfigService } from '@nestjs/config';

export function getRequiredSecret(
  configService: ConfigService,
  key: string,
): string {
  const value = configService.get<string>(key);
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Application cannot start securely.`,
    );
  }
  return value;
}

export function getJwtSecret(configService: ConfigService): string {
  return getRequiredSecret(configService, 'JWT_SECRET');
}

export function getJwtRefreshSecret(configService: ConfigService): string {
  return getRequiredSecret(configService, 'JWT_REFRESH_SECRET');
}
