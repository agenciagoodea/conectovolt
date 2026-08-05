import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConnectorType, ConnectorStatus } from '../../../common/enums';

export class CreateConnectorDto {
  @ApiProperty({ enum: ConnectorType, example: 'TYPE2' })
  @IsEnum(ConnectorType)
  type: ConnectorType;

  @ApiPropertyOptional({ example: 22 })
  @IsOptional()
  @IsNumber()
  powerKw?: number;
}

export class UpdateConnectorDto {
  @ApiPropertyOptional({ enum: ConnectorStatus })
  @IsOptional()
  @IsEnum(ConnectorStatus)
  status?: ConnectorStatus;

  @ApiPropertyOptional({ example: 22 })
  @IsOptional()
  @IsNumber()
  powerKw?: number;
}
