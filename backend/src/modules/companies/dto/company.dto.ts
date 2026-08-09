import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyStatus } from '../../../common/enums';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Empresa XYZ' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '00000000000000' })
  @IsString()
  document: string;

  @ApiPropertyOptional({ example: 'contato@empresa.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+5511888888888' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({ example: 'Empresa XYZ' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: 'contato@empresa.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+5511888888888' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class AdminUpdateCompanyDto extends UpdateCompanyDto {
  @ApiPropertyOptional({ enum: CompanyStatus })
  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;
}
