import { IsString, IsNumber, IsEnum, IsDate, IsArray, Min } from 'class-validator';
import { FoodCategory } from '@food-waste/types';

export class CreateFoodItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsDate()
  expiryDate: Date;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsEnum(FoodCategory)
  category: FoodCategory;
} 