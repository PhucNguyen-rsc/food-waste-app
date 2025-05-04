import { Prisma } from '@food-waste/database';

export class TestFactory {
  static createUser(overrides: Partial<Prisma.UserCreateInput> = {}): Prisma.UserCreateInput {
    return {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'CONSUMER',
      ...overrides,
    };
  }

  static createFoodItem(overrides: Partial<Prisma.FoodItemCreateInput> = {}): Prisma.FoodItemCreateInput {
    const defaultBusinessId = 'test-business-id';
    return {
      name: 'Test Food Item',
      description: 'Test Description',
      price: 10.99,
      originalPrice: 15.99,
      quantity: 5,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      images: ['test-image.jpg'],
      category: 'MEAT',
      status: 'AVAILABLE',
      business: {
        connect: {
          id: (overrides as any).businessId || defaultBusinessId
        }
      },
      ...overrides,
    };
  }

  static createOrder(overrides: Partial<Prisma.OrderCreateInput> = {}): Prisma.OrderCreateInput {
    const defaultConsumerId = 'test-consumer-id';
    const defaultBusinessId = 'test-business-id';
    return {
      status: 'PENDING',
      totalAmount: 0,
      deliveryAddress: 'Test Address',
      consumer: {
        connect: {
          id: (overrides as any).consumerId || defaultConsumerId
        }
      },
      business: {
        connect: {
          id: (overrides as any).businessId || defaultBusinessId
        }
      },
      ...overrides,
    };
  }

  static createOrderItem(overrides: Partial<Prisma.OrderItemCreateInput> = {}): Prisma.OrderItemCreateInput {
    const defaultOrderId = 'test-order-id';
    const defaultFoodItemId = 'test-food-item-id';
    return {
      quantity: 1,
      price: 10.99,
      order: {
        connect: {
          id: (overrides as any).orderId || defaultOrderId
        }
      },
      foodItem: {
        connect: {
          id: (overrides as any).foodItemId || defaultFoodItemId
        }
      },
      ...overrides,
    };
  }
} 