import { Controller, Get, Param, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserRole } from '@food-waste/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findByFirebaseUid(id);
  }

  @Patch('update-role')
  @UseGuards(JwtAuthGuard)
  async updateRole(@Request() req, @Body('role') role: UserRole) {
    return this.usersService.updateRole(req.user.id, role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: { deliveryAddress?: string }
  ) {
    return this.usersService.updateUser(id, updateData);
  }
} 