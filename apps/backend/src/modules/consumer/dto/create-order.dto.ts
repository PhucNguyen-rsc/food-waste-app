import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  foodItemId: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  deliveryAddress: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  paymentMethod: 'Cash' | 'Card';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
} 