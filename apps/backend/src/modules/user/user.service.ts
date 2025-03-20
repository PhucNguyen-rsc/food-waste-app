import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { User, UserRole } from '@food-waste/database';
import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@app/modules/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  // Business-specific methods
  async updateBusinessProfile(id: string, businessData: {
    businessName: string;
    businessAddress: string;
    businessPhone: string;
  }): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: businessData,
    });
  }

  // Consumer-specific methods
  async updateDeliveryAddress(id: string, deliveryAddress: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { deliveryAddress },
    });
  }

  // Courier-specific methods
  async updateCourierStatus(id: string, isAvailable: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isAvailable },
    });
  }

  async updateCourierLocation(id: string, currentLocation: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { currentLocation },
    });
  }
} 