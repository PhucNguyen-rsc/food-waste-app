import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateFoodItemDto } from '@business/dto/create-food-item.dto';
import { UpdateFoodItemDto } from '@business/dto/update-food-item.dto';
import { FoodStatus } from '@food-waste/types';
import { UpdateBusinessDto } from '@business/dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async createFoodItem(businessId: string, createFoodItemDto: CreateFoodItemDto) {
    console.log(`[BusinessService] Creating food item for business ${businessId}:`, createFoodItemDto);
    
    // Convert expiryDate string to DateTime
    const expiryDate = new Date(createFoodItemDto.expiryDate);
    
    const foodItem = await this.prisma.foodItem.create({
      data: {
        ...createFoodItemDto,
        expiryDate,
        businessId,
      },
    });
    console.log(`[BusinessService] Food item created successfully:`, foodItem);
    return foodItem;
  }

  async findAllFoodItems(businessId: string) {
    console.log(`[BusinessService] Fetching all food items for business ${businessId}`);
    const items = await this.prisma.foodItem.findMany({
      where: {
        businessId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(`[BusinessService] Found ${items.length} food items`);
    return items;
  }

  async findOneFoodItem(businessId: string, id: string) {
    console.log(`[BusinessService] Fetching food item ${id} for business ${businessId}`);
    const foodItem = await this.prisma.foodItem.findFirst({
      where: {
        id,
        businessId,
      },
    });

    if (!foodItem) {
      console.log(`[BusinessService] Food item ${id} not found for business ${businessId}`);
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }

    console.log(`[BusinessService] Found food item:`, foodItem);
    return foodItem;
  }

  async updateFoodItem(businessId: string, id: string, updateFoodItemDto: UpdateFoodItemDto) {
    console.log(`[BusinessService] Updating food item ${id} for business ${businessId}:`, updateFoodItemDto);
    try {
      const updatedItem = await this.prisma.foodItem.update({
        where: {
          id,
          businessId,
        },
        data: updateFoodItemDto,
      });
      console.log(`[BusinessService] Food item updated successfully:`, updatedItem);
      return updatedItem;
    } catch (error) {
      console.error(`[BusinessService] Error updating food item ${id}:`, error);
      if (error.code === 'P2025') {
      throw new NotFoundException(`Food item with ID ${id} not found`);
      }
      throw error;
    }
  }

  async removeFoodItem(businessId: string, id: string) {
    console.log(`[BusinessService] Removing food item ${id} for business ${businessId}`);
    try {
      const deletedItem = await this.prisma.foodItem.delete({
        where: {
          id,
          businessId,
        },
      });
      console.log(`[BusinessService] Food item removed successfully:`, deletedItem);
      return deletedItem;
    } catch (error) {
      console.error(`[BusinessService] Error removing food item ${id}:`, error);
      if (error.code === 'P2025') {
      throw new NotFoundException(`Food item with ID ${id} not found`);
      }
      throw error;
    }
  }

  async updateFoodItemStatus(businessId: string, id: string, status: FoodStatus) {
    console.log(`[BusinessService] Updating status of food item ${id} to ${status} for business ${businessId}`);
    try {
      const updatedItem = await this.prisma.foodItem.update({
        where: {
          id,
          businessId,
        },
        data: { status },
      });
      console.log(`[BusinessService] Food item status updated successfully:`, updatedItem);
      return updatedItem;
    } catch (error) {
      console.error(`[BusinessService] Error updating food item status ${id}:`, error);
      if (error.code === 'P2025') {
      throw new NotFoundException(`Food item with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getBusinessOrders(businessId: string) {
    console.log(`[BusinessService] Fetching all orders for business ${businessId}`);
    const orders = await this.prisma.order.findMany({
      where: {
        businessId,
      },
      include: {
        consumer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        courier: {
          select: {
            id: true,
            name: true,
            email: true,
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
    console.log(`[BusinessService] Found ${orders.length} orders`);
    return orders;
  }

  async getBusinessOrder(businessId: string, orderId: string) {
    console.log(`[BusinessService] Fetching order ${orderId} for business ${businessId}`);
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        businessId,
      },
      include: {
        consumer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        courier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            foodItem: true,
          },
        },
      },
    });

    if (!order) {
      console.log(`[BusinessService] Order ${orderId} not found for business ${businessId}`);
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    console.log(`[BusinessService] Found order:`, order);
    return order;
  }

  async updateBusinessDetails(businessId: string, updateBusinessDto: UpdateBusinessDto) {
    console.log(`[BusinessService] Updating business details for ${businessId}:`, updateBusinessDto);
    
    try {
    const updatedBusiness = await this.prisma.user.update({
      where: { id: businessId },
      data: updateBusinessDto,
    });

    console.log(`[BusinessService] Business details updated successfully:`, updatedBusiness);
    return updatedBusiness;
    } catch (error) {
      console.error(`[BusinessService] Error updating business details:`, error);
      if (error.code === 'P2025') {
        throw new NotFoundException(`Business with ID ${businessId} not found`);
      }
      throw error;
    }
  }

  async updateFoodItemPrice(userId: string, itemId: string, price: number) {
    const foodItem = await this.prisma.foodItem.findUnique({
      where: { id: itemId },
      include: { business: true },
    });

    if (!foodItem) {
      throw new NotFoundException('Food item not found');
    }

    if (foodItem.business.id !== userId) {
      throw new UnauthorizedException('Not authorized to update this food item');
    }

    return this.prisma.foodItem.update({
      where: { id: itemId },
      data: { price },
    });
  }

  async updateDynamicPricing(
    userId: string,
    itemId: string,
    dynamicPricingDto: {
      discountPercentage: number;
      discountThreshold: number;
      price: number;
    },
  ) {
    const foodItem = await this.prisma.foodItem.findUnique({
      where: { id: itemId },
      include: { business: true },
    });

    if (!foodItem) {
      throw new NotFoundException('Food item not found');
    }

    if (foodItem.business.id !== userId) {
      throw new UnauthorizedException('Not authorized to update this food item');
    }

    return this.prisma.foodItem.update({
      where: { id: itemId },
      data: {
        price: dynamicPricingDto.price,
        discountPercentage: dynamicPricingDto.discountPercentage,
        discountThreshold: dynamicPricingDto.discountThreshold,
      },
    });
  }

  async removeDynamicPricing(userId: string, itemId: string) {
    const foodItem = await this.prisma.foodItem.findUnique({
      where: { id: itemId },
      include: { business: true },
    });

    if (!foodItem) {
      throw new NotFoundException('Food item not found');
    }

    if (foodItem.business.id !== userId) {
      throw new UnauthorizedException('Not authorized to update this food item');
    }

    return this.prisma.foodItem.update({
      where: { id: itemId },
      data: {
        discountPercentage: null,
        discountThreshold: null,
      },
    });
  }
} 