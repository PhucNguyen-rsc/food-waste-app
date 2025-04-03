import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UserRole } from '@food-waste/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByFirebaseUid(firebaseUid: string) {
    return this.prisma.user.findUnique({
      where: { id: firebaseUid },
    });
  }

  async create(data: {
    email: string;
    id: string; // This will be the Firebase UID
    role: UserRole;
    name?: string;
  }) {
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
} 