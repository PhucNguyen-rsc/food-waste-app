import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CourierService } from './courier.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole, OrderStatus } from '@food-waste/types';

@Controller('courier')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.COURIER)
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @Get('new-requests')
  async getNewRequests(@Request() req) {
    return this.courierService.getNewRequests(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.courierService.getStats(req.user.id);
  }

  @Get('active-delivery')
  async getActiveDelivery(@Request() req) {
    return this.courierService.getActiveDelivery(req.user.id);
  }

  @Put('deliveries/:id/status')
  async updateDeliveryStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.courierService.updateDeliveryStatus(req.user.id, id, status);
  }

  @Get('history')
  async getHistory(@Request() req) {
    return this.courierService.getHistory(req.user.id);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return this.courierService.getProfile(req.user.id);
  }

  @Get('earnings')
  async getEarnings(@Request() req) {
    return this.courierService.getEarnings(req.user.id);
  }

  @Put('deliveries/:id/accept')
  async acceptDelivery(@Request() req, @Param('id') id: string) {
    return this.courierService.acceptDelivery(req.user.id, id);
  }
} 