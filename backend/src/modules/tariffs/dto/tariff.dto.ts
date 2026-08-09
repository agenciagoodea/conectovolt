import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTariffDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Tarifa Padrao' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 2.5 })
  @IsNumber()
  @Min(0)
  pricePerKwh: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateTariffDto {
  @ApiPropertyOptional({ example: 'Tarifa Promocional' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: 3.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerKwh?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
