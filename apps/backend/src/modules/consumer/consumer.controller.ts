import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@food-waste/types';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('consumer')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.CONSUMER)
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Get('orders')
  async getOrders(@Request() req) {
    return this.consumerService.getOrders(req.user.id);
  }

  @Post('orders')
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.consumerService.createOrder(req.user.id, createOrderDto);
  }
} 