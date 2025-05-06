import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UserRole } from '@food-waste/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findByFirebaseUid(id: string) {
    console.log('Finding user by Firebase UID:', id);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    console.log('User search result:', user ? {
      id: user.id,
      email: user.email,
      role: user.role
    } : 'Not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    id: string; // This will be the Firebase UID
    role: UserRole;
    name?: string;
  }) {
    try {
    // Check if user with this email already exists
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

      return await this.prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name || null,
        role: data.role,
        // Set default values for other required fields
        emailVerified: null,
        image: null,
        password: null,
        // Business specific fields
        businessName: null,
        businessAddress: null,
        businessPhone: null,
        // Consumer specific fields
        deliveryAddress: null,
        // Courier specific fields
        isAvailable: false,
        currentLocation: null,
        vehicleType: null,
      },
    });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }

  async updateRole(userId: string, role: UserRole) {
    console.log('\n=== Updating User Role in Database ===');
    console.log('User ID:', userId);
    console.log('New Role:', role);

    try {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    // Generate new JWT token with updated role
    const payload = {
      sub: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    };
    const accessToken = this.jwtService.sign(payload);

    console.log('Database Update Result:', {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role
    });
    console.log('========================\n');

    return {
      accessToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        // Include role-specific fields
        ...(updatedUser.role === UserRole.BUSINESS && {
          businessName: updatedUser.businessName,
          businessAddress: updatedUser.businessAddress,
          businessPhone: updatedUser.businessPhone,
        }),
        ...(updatedUser.role === UserRole.CONSUMER && {
          deliveryAddress: updatedUser.deliveryAddress,
        }),
        ...(updatedUser.role === UserRole.COURIER && {
          isAvailable: updatedUser.isAvailable,
          currentLocation: updatedUser.currentLocation,
          vehicleType: updatedUser.vehicleType,
        }),
      },
    };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async updateUser(userId: string, updateData: { deliveryAddress?: string }) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        // Include role-specific fields
        ...(updatedUser.role === UserRole.BUSINESS && {
          businessName: updatedUser.businessName,
          businessAddress: updatedUser.businessAddress,
          businessPhone: updatedUser.businessPhone,
        }),
        ...(updatedUser.role === UserRole.CONSUMER && {
          deliveryAddress: updatedUser.deliveryAddress,
        }),
        ...(updatedUser.role === UserRole.COURIER && {
          isAvailable: updatedUser.isAvailable,
          currentLocation: updatedUser.currentLocation,
          vehicleType: updatedUser.vehicleType,
        }),
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
} 