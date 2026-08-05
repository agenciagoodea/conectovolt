import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartChargingDto {
  @ApiProperty({ description: 'ID do carregador' })
  @IsString()
  chargerId: string;

  @ApiPropertyOptional({ description: 'ID do conector' })
  @IsOptional()
  @IsString()
  connectorId?: string;

  @ApiPropertyOptional({ description: 'ID do veiculo' })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'ID do posto' })
  @IsOptional()
  @IsString()
  stationId?: string;
}

export class UpdateEnergyDto {
  @ApiProperty({ description: 'Energia consumida em kWh' })
  @IsNumber()
  @Min(0)
  energyKwh: number;
}

export class StopChargingDto {
  @ApiProperty({ description: 'Energia total consumida em kWh' })
  @IsNumber()
  @Min(0)
  energyKwh: number;
}
