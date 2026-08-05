import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentGateway } from '../../../common/enums';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID da sessao de recarga' })
  @IsString()
  sessionId: string;

  @ApiProperty({ enum: PaymentGateway, example: 'PIX' })
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;
}
