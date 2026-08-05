import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Tesla' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Model 3' })
  @IsString()
  model: string;

  @ApiProperty({ example: 'ABC1234' })
  @IsString()
  plate: string;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  batteryCapacity?: number;
}

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'Tesla' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'Model Y' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'DEF5678' })
  @IsOptional()
  @IsString()
  plate?: string;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  batteryCapacity?: number;
}
