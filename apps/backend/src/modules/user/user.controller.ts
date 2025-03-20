import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { UserRole } from '@food-waste/database';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // Business-specific endpoints
  @Patch(':id/business-profile')
  @Roles(UserRole.BUSINESS)
  updateBusinessProfile(
    @Param('id') id: string,
    @Body() businessData: {
      businessName: string;
      businessAddress: string;
      businessPhone: string;
    },
  ) {
    return this.userService.updateBusinessProfile(id, businessData);
  }

  // Consumer-specific endpoints
  @Patch(':id/delivery-address')
  @Roles(UserRole.CONSUMER)
  updateDeliveryAddress(
    @Param('id') id: string,
    @Body('deliveryAddress') deliveryAddress: string,
  ) {
    return this.userService.updateDeliveryAddress(id, deliveryAddress);
  }

  // Courier-specific endpoints
  @Patch(':id/courier-status')
  @Roles(UserRole.COURIER)
  updateCourierStatus(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.userService.updateCourierStatus(id, isAvailable);
  }

  @Patch(':id/courier-location')
  @Roles(UserRole.COURIER)
  updateCourierLocation(
    @Param('id') id: string,
    @Body('currentLocation') currentLocation: string,
  ) {
    return this.userService.updateCourierLocation(id, currentLocation);
  }
} 