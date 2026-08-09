import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiPropertyOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsNumber()
  maxStations: number;

  @ApiPropertyOptional()
  @IsNumber()
  maxChargers: number;

  @ApiPropertyOptional()
  @IsNumber()
  maxUsers: number;
}

export class UpdatePlanDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxStations?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxChargers?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxUsers?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
