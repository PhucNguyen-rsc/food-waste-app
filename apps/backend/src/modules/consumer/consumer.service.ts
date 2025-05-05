import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { OrderStatus } from '@food-waste/types';

interface OrderItemWithBusiness extends OrderItemDto {
  businessId: string;
}

@Injectable()
export class ConsumerService {
  constructor(private prisma: PrismaService) {}

  async createOrder(consumerId: string, createOrderDto: CreateOrderDto) {
    // First, validate that all food items exist and have sufficient quantity
    const foodItems = await this.prisma.foodItem.findMany({
      where: {
        id: {
          in: createOrderDto.items.map(item => item.foodItemId)
        }
      }
    });

    if (foodItems.length !== createOrderDto.items.length) {
      throw new BadRequestException('One or more food items not found');
    }

    // Calculate total amount and validate quantities
    let totalAmount = 0;
    const itemsWithBusiness = createOrderDto.items.map(orderItem => {
      const foodItem = foodItems.find(fi => fi.id === orderItem.foodItemId);
      if (!foodItem) {
        throw new BadRequestException(`Food item ${orderItem.foodItemId} not found`);
      }
      if (foodItem.quantity < orderItem.quantity) {
        throw new BadRequestException(`Insufficient quantity for ${foodItem.name}`);
      }
      totalAmount += foodItem.price * orderItem.quantity;
      return {
        ...orderItem,
        businessId: foodItem.businessId
      };
    });

    // Group items by business
    const itemsByBusiness: Record<string, OrderItemWithBusiness[]> = itemsWithBusiness.reduce((acc, item) => {
      if (!acc[item.businessId]) {
        acc[item.businessId] = [];
      }
      acc[item.businessId].push(item);
      return acc;
    }, {} as Record<string, OrderItemWithBusiness[]>);

    // Create orders for each business
    const orders = await Promise.all(
      Object.entries(itemsByBusiness).map(([businessId, items]: [string, OrderItemWithBusiness[]]) => {
        const businessTotal = items.reduce((sum, item) => {
          const foodItem = foodItems.find(fi => fi.id === item.foodItemId);
          return sum + (foodItem?.price || 0) * item.quantity;
        }, 0);

        return this.prisma.order.create({
          data: {
            consumerId,
            businessId,
            status: OrderStatus.PENDING,
            totalAmount: businessTotal,
            deliveryAddress: createOrderDto.deliveryAddress,
            items: {
              create: items.map(item => ({
                foodItemId: item.foodItemId,
                quantity: item.quantity,
                price: foodItems.find(fi => fi.id === item.foodItemId)?.price || 0
              }))
            }
          },
          include: {
            items: {
              include: {
                foodItem: true
              }
            },
            business: {
              select: {
                name: true,
                businessAddress: true
              }
            }
          }
        });
      })
    );

    // Update food item quantities
    await Promise.all(
      createOrderDto.items.map(item => 
        this.prisma.foodItem.update({
          where: { id: item.foodItemId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        })
      )
    );

    return orders;
  }

  async getOrders(consumerId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        consumerId,
      },
      include: {
        business: {
          select: {
            businessName: true,
            businessAddress: true,
          },
        },
        items: {
          include: {
            foodItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map(order => ({
      id: order.id,
      status: order.status,
      businessName: order.business.businessName,
      totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        name: item.foodItem.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
  }
} 