import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@food-waste/database';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  // Business fields
  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  businessAddress?: string;

  @IsString()
  @IsOptional()
  businessPhone?: string;

  // Consumer fields
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  // Courier fields
  @IsString()
  @IsOptional()
  vehicleType?: string;
} 