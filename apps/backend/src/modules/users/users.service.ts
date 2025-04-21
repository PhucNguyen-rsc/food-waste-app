import { Injectable, ConflictException } from '@nestjs/common';
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
    return this.prisma.user.findUnique({
      where: { id },
    });
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
    // Check if user with this email already exists
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    return this.prisma.user.create({
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
  }

  async updateRole(userId: string, role: UserRole) {
    console.log('\n=== Updating User Role in Database ===');
    console.log('User ID:', userId);
    console.log('New Role:', role);

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
  }
} 