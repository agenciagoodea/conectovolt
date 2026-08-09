import { IsOptional, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartChargingDto {
  @ApiProperty({ description: 'ID do carregador' })
  @IsUUID()
  chargerId: string;

  @ApiPropertyOptional({ description: 'ID do conector' })
  @IsOptional()
  @IsUUID()
  connectorId?: string;

  @ApiPropertyOptional({ description: 'ID do veiculo' })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'ID do posto' })
  @IsOptional()
  @IsUUID()
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
