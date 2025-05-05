import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BusinessService } from '@business/business.service';
import { CreateFoodItemDto } from '@business/dto/create-food-item.dto';
import { UpdateFoodItemDto } from '@business/dto/update-food-item.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { Roles } from '@decorators/roles.decorator';
import { UserRole } from '@food-waste/types';
import { FoodStatus } from '@food-waste/types';
import { UpdateBusinessDto } from '@business/dto/update-business.dto';

@Controller('business')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.BUSINESS)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('food-items')
  async createFoodItem(@Request() req, @Body() createFoodItemDto: CreateFoodItemDto) {
    console.log(`[BusinessController] Creating food item for user ${req.user.id}:`, createFoodItemDto);
    const result = await this.businessService.createFoodItem(req.user.id, createFoodItemDto);
    console.log(`[BusinessController] Food item created successfully:`, result);
    return result;
  }

  @Get('food-items')
  async findAllFoodItems(@Request() req) {
    console.log(`[BusinessController] Fetching all food items for user ${req.user.id}`);
    const result = await this.businessService.findAllFoodItems(req.user.id);
    console.log(`[BusinessController] Found ${result.length} food items`);
    return result;
  }

  @Get('food-items/:id')
  async findOneFoodItem(@Request() req, @Param('id') id: string) {
    console.log(`[BusinessController] Fetching food item ${id} for user ${req.user.id}`);
    const result = await this.businessService.findOneFoodItem(req.user.id, id);
    console.log(`[BusinessController] Found food item:`, result);
    return result;
  }

  @Patch('food-items/:id')
  async updateFoodItem(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFoodItemDto: UpdateFoodItemDto,
  ) {
    console.log(`[BusinessController] Updating food item ${id} for user ${req.user.id}:`, updateFoodItemDto);
    const result = await this.businessService.updateFoodItem(req.user.id, id, updateFoodItemDto);
    console.log(`[BusinessController] Food item updated successfully:`, result);
    return result;
  }

  @Patch('food-items/:id/price')
  async updateFoodItemPrice(
    @Request() req,
    @Param('id') id: string,
    @Body('price') price: number,
  ) {
    console.log(`[BusinessController] Updating price of food item ${id} to ${price} for user ${req.user.id}`);
    const result = await this.businessService.updateFoodItemPrice(req.user.id, id, price);
    console.log(`[BusinessController] Food item price updated successfully:`, result);
    return result;
  }

  @Patch('food-items/:id/dynamic-pricing')
  async updateDynamicPricing(
    @Request() req,
    @Param('id') id: string,
    @Body() dynamicPricingDto: {
      discountPercentage: number;
      discountThreshold: number;
      price: number;
    },
  ) {
    console.log(`[BusinessController] Updating dynamic pricing for food item ${id} for user ${req.user.id}:`, dynamicPricingDto);
    const result = await this.businessService.updateDynamicPricing(req.user.id, id, dynamicPricingDto);
    console.log(`[BusinessController] Dynamic pricing updated successfully:`, result);
    return result;
  }

  @Delete('food-items/:id/dynamic-pricing')
  async removeDynamicPricing(
    @Request() req,
    @Param('id') id: string,
  ) {
    console.log(`[BusinessController] Removing dynamic pricing for food item ${id} for user ${req.user.id}`);
    const result = await this.businessService.removeDynamicPricing(req.user.id, id);
    console.log(`[BusinessController] Dynamic pricing removed successfully:`, result);
    return result;
  }

  @Delete('food-items/:id')
  async removeFoodItem(@Request() req, @Param('id') id: string) {
    console.log(`[BusinessController] Removing food item ${id} for user ${req.user.id}`);
    const result = await this.businessService.removeFoodItem(req.user.id, id);
    console.log(`[BusinessController] Food item removed successfully:`, result);
    return result;
  }

  @Patch('food-items/:id/status')
  async updateFoodItemStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: FoodStatus,
  ) {
    console.log(`[BusinessController] Updating status of food item ${id} to ${status} for user ${req.user.id}`);
    const result = await this.businessService.updateFoodItemStatus(req.user.id, id, status);
    console.log(`[BusinessController] Food item status updated successfully:`, result);
    return result;
  }

  @Get('orders')
  async getBusinessOrders(@Request() req) {
    console.log(`[BusinessController] Fetching all orders for user ${req.user.id}`);
    const result = await this.businessService.getBusinessOrders(req.user.id);
    console.log(`[BusinessController] Found ${result.length} orders`);
    return result;
  }

  @Get('orders/:id')
  async getBusinessOrder(@Request() req, @Param('id') id: string) {
    console.log(`[BusinessController] Fetching order ${id} for user ${req.user.id}`);
    const result = await this.businessService.getBusinessOrder(req.user.id, id);
    console.log(`[BusinessController] Found order:`, result);
    return result;
  }

  @Patch('profile')
  async updateBusinessProfile(
    @Request() req,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    console.log(`[BusinessController] Updating business profile for user ${req.user.id}:`, updateBusinessDto);
    const result = await this.businessService.updateBusinessDetails(req.user.id, updateBusinessDto);
    console.log(`[BusinessController] Business profile updated successfully:`, result);
    return result;
  }
} 