import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateBusinessDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  businessName?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  businessAddress?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  businessPhone?: string;
} 