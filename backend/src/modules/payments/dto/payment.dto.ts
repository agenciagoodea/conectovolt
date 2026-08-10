import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentGateway } from '../../../common/enums';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID da sessao de recarga' })
  @IsString()
  @MinLength(1)
  sessionId: string;

  @ApiProperty({ enum: PaymentGateway, example: 'PIX' })
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @ApiPropertyOptional({
    description: 'Token temporario gerado pelo Mercado Pago',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  cardToken?: string;

  @ApiPropertyOptional({ example: 'mastercard' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  paymentMethodId?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number;
}

export class PaymentWebhookDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  data?: { id?: string | number };

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;
}
