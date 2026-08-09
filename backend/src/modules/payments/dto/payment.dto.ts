import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentGateway } from '../../../common/enums';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID da sessao de recarga' })
  @IsUUID()
  sessionId: string;

  @ApiProperty({ enum: PaymentGateway, example: 'PIX' })
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;
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
