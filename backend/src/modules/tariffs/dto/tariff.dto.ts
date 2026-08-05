import { IsString, IsNumber, IsOptional, IsBoolean, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTariffDto {
  @ApiProperty()
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'Tarifa Padrao' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 2.50 })
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

  @ApiPropertyOptional({ example: 3.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerKwh?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
