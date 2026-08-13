import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartChargingDto {
  @ApiProperty({ description: 'ID do carregador' })
  @IsString()
  @MinLength(1)
  chargerId: string;

  @ApiPropertyOptional({ description: 'ID do conector' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  connectorId?: string;

  @ApiPropertyOptional({ description: 'ID do veiculo' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'ID do posto' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  stationId?: string;
}

export class UpdateEnergyDto {
  @ApiProperty({ description: 'Energia consumida em kWh' })
  @IsNumber()
  @Min(0)
  energyKwh: number;
}

export class StopChargingDto {
  @ApiPropertyOptional({ description: 'Energia total consumida em kWh (opcional — usa ultimo valor da sessao)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  energyKwh?: number;
}
