import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChargerStatus } from '../../../common/enums';

export class CreateChargerDto {
  @ApiProperty()
  @IsString()
  stationId: string;

  @ApiProperty({ example: 'SN-ABC123' })
  @IsString()
  serialNumber: string;

  @ApiPropertyOptional({ example: 'Wallbox Pro' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'ABB' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  powerKw?: number;

  @ApiPropertyOptional({ example: 'OCPP-CENTRO-01' })
  @IsOptional()
  @IsString()
  ocppId?: string;
}

export class UpdateChargerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stationId?: string;

  @ApiPropertyOptional({ example: 'SN-ABC123' })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({ example: 'Wallbox Pro' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'ABB' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  powerKw?: number;

  @ApiPropertyOptional({ example: 'OCPP-CENTRO-01' })
  @IsOptional()
  @IsString()
  ocppId?: string;

  @ApiPropertyOptional({ enum: ChargerStatus })
  @IsOptional()
  @IsEnum(ChargerStatus)
  status?: ChargerStatus;
}

export class UpdateChargerStatusDto {
  @ApiProperty({ enum: ChargerStatus })
  @IsEnum(ChargerStatus)
  status: ChargerStatus;
}
