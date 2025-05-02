import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { OrderStatus } from '@food-waste/types';

@Injectable()
export class CourierService {
  constructor(private prisma: PrismaService) {}

  async getNewRequests(courierId: string) {
    const requests = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
        courierId: null,
      },
      include: {
        consumer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            businessAddress: true,
          },
        },
      },
    });

    return requests.map(request => ({
      id: request.id,
      customerName: request.consumer.name,
      customerPhotoUrl: request.consumer.image,
      distanceKm: 5, // TODO: Calculate actual distance
      pickupAddress: request.business.businessAddress,
      rewardAed: request.totalAmount * 0.2, // 20% of order total as reward
    }));
  }

  async getStats(courierId: string) {
    const [completed, earnings] = await Promise.all([
      this.prisma.order.count({
        where: {
          courierId,
          status: {
            in: [OrderStatus.COURIER_DELIVERED, OrderStatus.DELIVERED]
          },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          courierId,
          status: {
            in: [OrderStatus.COURIER_DELIVERED, OrderStatus.DELIVERED]
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    return {
      completed,
      earnings: Math.floor((earnings._sum.totalAmount || 0) * 0.2), // 20% of total earnings
      rating: 4.5, // TODO: Implement actual rating system
    };
  }

  async getActiveDelivery(courierId: string) {
    const delivery = await this.prisma.order.findFirst({
      where: {
        courierId,
        status: {
          in: [OrderStatus.CONFIRMED, OrderStatus.PICKED_UP],
        },
      },
      include: {
        consumer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            businessAddress: true,
          },
        },
      },
    });

    if (!delivery) {
      return null;
    }

    return {
      id: delivery.id,
      orderId: delivery.id,
      pickupAddress: delivery.business?.businessAddress || '',
      deliveryAddress: delivery.deliveryAddress,
      status: delivery.status,
      customerName: delivery.consumer?.name || '',
      customerEmail: delivery.consumer?.email || '',
      estimatedTime: '30 mins', // TODO: Calculate actual ETA
    };
  }

  async updateDeliveryStatus(courierId: string, deliveryId: string, status: OrderStatus) {
    const delivery = await this.prisma.order.findFirst({
      where: {
        id: deliveryId,
        courierId,
      },
      include: {
        business: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${deliveryId} not found`);
    }

    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [],
      [OrderStatus.BUSINESS_CONFIRMED]: [],
      [OrderStatus.CONFIRMED]: [OrderStatus.PICKED_UP],
      [OrderStatus.PREPARING]: [],
      [OrderStatus.READY]: [],
      [OrderStatus.PICKED_UP]: [OrderStatus.COURIER_DELIVERED],
      [OrderStatus.COURIER_DELIVERED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[delivery.status]?.includes(status)) {
      throw new Error(`Invalid status transition from ${delivery.status} to ${status}`);
    }

    const updatedDelivery = await this.prisma.order.update({
      where: { id: deliveryId },
      data: {
        status,
        ...(status === OrderStatus.COURIER_DELIVERED ? {
          completedAt: new Date(),
        } : {}),
      },
      include: {
        business: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      id: updatedDelivery.id,
      status: updatedDelivery.status,
      businessName: updatedDelivery.business.name,
      completedAt: updatedDelivery.completedAt?.toISOString(),
    };
  }

  async getHistory(courierId: string) {
    const deliveries = await this.prisma.order.findMany({
      where: {
        courierId,
        status: {
          in: [
            OrderStatus.CONFIRMED,
            OrderStatus.PICKED_UP,
            OrderStatus.COURIER_DELIVERED,
            OrderStatus.DELIVERED
          ],
        },
      },
      include: {
        consumer: {
          select: {
            name: true,
          },
        },
        business: {
          select: {
            businessAddress: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return deliveries.map(delivery => ({
      id: delivery.id,
      orderId: delivery.id,
      status: delivery.status,
      customerName: delivery.consumer.name,
      pickupAddress: delivery.business.businessAddress,
      deliveryAddress: delivery.deliveryAddress,
      completedAt: delivery.status === OrderStatus.COURIER_DELIVERED || delivery.status === OrderStatus.DELIVERED 
        ? delivery.updatedAt.toISOString() 
        : undefined,
      totalAmount: delivery.totalAmount,
    }));
  }

  async getProfile(courierId: string) {
    const courier = await this.prisma.user.findUnique({
      where: { id: courierId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!courier) {
      throw new NotFoundException(`Courier with ID ${courierId} not found`);
    }

    return {
      id: courier.id,
      name: courier.name || '',
      email: courier.email || '',
      avatarUrl: courier.image || '',
    };
  }

  async getEarnings(courierId: string) {
    const deliveries = await this.prisma.order.findMany({
      where: {
        courierId,
        status: {
          in: [OrderStatus.COURIER_DELIVERED, OrderStatus.DELIVERED]
        },
      },
      select: {
        totalAmount: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const earningsByDate: Record<string, { amount: number; deliveryCount: number }> = deliveries.reduce((acc, delivery) => {
      const date = delivery.updatedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          amount: 0,
          deliveryCount: 0,
        };
      }
      acc[date].amount += Math.floor(delivery.totalAmount * 0.2);
      acc[date].deliveryCount += 1;
      return acc;
    }, {} as Record<string, { amount: number; deliveryCount: number }>);

    const entries = Object.entries(earningsByDate).map(([date, data]) => ({
      id: date,
      date,
      amount: data.amount,
      deliveryCount: data.deliveryCount,
    }));

    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

    return {
      entries,
      total,
    };
  }

  async acceptDelivery(courierId: string, deliveryId: string) {
    const delivery = await this.prisma.order.findFirst({
      where: {
        id: deliveryId,
        status: OrderStatus.PENDING,
        courierId: null,
      },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${deliveryId} not found or not available`);
    }

    return this.prisma.order.update({
      where: { id: deliveryId },
      data: {
        courierId,
        status: OrderStatus.CONFIRMED,
      },
    });
  }
} 