import { prismaAPI, OrderStatus } from '@food-waste/database';
import api from './api';

// Courier database interface
export const courierDB = {
  /**
   * Get all deliveries for a courier
   * @param userId The courier's user ID
   * @returns Promise resolving to an array of delivery orders
   */
  async getDeliveries(userId: string) {
    try {
      const response = await api.get(`/courier/${userId}/deliveries`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
      // Fallback to direct API if needed
      return prismaAPI.order.findMany({
        where: {
          courierId: userId,
        },
        include: {
          user: true,
          restaurant: true,
          items: {
            include: {
              foodItem: true,
            },
          },
        },
      });
    }
  },

  /**
   * Update the status of a delivery
   * @param orderId The order ID
   * @param status The new status
   * @returns Promise resolving to the updated order
   */
  async updateDeliveryStatus(orderId: string, status: OrderStatus) {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      // Fallback to direct API
      return prismaAPI.order.update({
        where: { id: orderId },
        data: { status },
      });
    }
  },

  /**
   * Get a courier's profile
   * @param userId The courier's user ID
   * @returns Promise resolving to the courier's profile
   */
  async getCourierProfile(userId: string) {
    try {
      const response = await api.get(`/courier/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch courier profile:', error);
      // Fallback to direct API
      return prismaAPI.user.findUnique({
        where: { id: userId },
        include: {
          courierProfile: true,
        },
      });
    }
  },

  /**
   * Update a courier's profile
   * @param userId The courier's user ID
   * @param updates The profile updates
   * @returns Promise resolving to the updated profile
   */
  async updateCourierProfile(userId: string, updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    vehicleType?: string;
    licenseNumber?: string;
    insuranceNumber?: string;
  }) {
    try {
      const response = await api.patch(`/courier/${userId}/profile`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update courier profile:', error);
      // Fallback to direct API
      return prismaAPI.user.update({
        where: { id: userId },
        data: {
          firstName: updates.firstName,
          lastName: updates.lastName,
          phone: updates.phone,
          address: updates.address,
          city: updates.city,
          country: updates.country,
          postalCode: updates.postalCode,
          courierProfile: {
            update: {
              vehicleType: updates.vehicleType,
              licenseNumber: updates.licenseNumber,
              insuranceNumber: updates.insuranceNumber,
            },
          },
        },
        include: {
          courierProfile: true,
        },
      });
    }
  },

  /**
   * Get available deliveries that are not assigned to any courier
   * @returns Promise resolving to an array of available delivery orders
   */
  async getAvailableDeliveries() {
    try {
      const response = await api.get('/courier/available-deliveries');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch available deliveries:', error);
      // Fallback to direct API
      return prismaAPI.order.findMany({
        where: {
          status: 'READY_FOR_PICKUP',
          courierId: null,
        },
        include: {
          restaurant: true,
          items: {
            include: {
              foodItem: true,
            },
          },
        },
      });
    }
  },

  /**
   * Accept a delivery and assign it to a courier
   * @param orderId The order ID
   * @param courierId The courier's user ID
   * @returns Promise resolving to the updated order
   */
  async acceptDelivery(orderId: string, courierId: string) {
    try {
      const response = await api.post(`/courier/${courierId}/accept-delivery`, { orderId });
      return response.data;
    } catch (error) {
      console.error('Failed to accept delivery:', error);
      // Fallback to direct API
      return prismaAPI.order.update({
        where: { id: orderId },
        data: {
          courierId,
          status: 'PICKED_UP',
        },
      });
    }
  },

  /**
   * Get courier earnings history
   * @param userId The courier's user ID
   * @returns Promise resolving to the courier's earnings history
   */
  async getCourierEarnings(userId: string) {
    try {
      const response = await api.get(`/courier/${userId}/earnings`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch courier earnings:', error);
      // Fallback to direct API - example of complex query that would be done on the server
      const completedOrders = await prismaAPI.order.findMany({
        where: {
          courierId: userId,
          status: 'DELIVERED',
        },
        select: {
          id: true,
          totalPrice: true,
          deliveryFee: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      // Calculate earnings (simplified example)
      return {
        totalEarnings: completedOrders.reduce((sum: number, order: any) => sum + Number(order.deliveryFee), 0),
        orders: completedOrders
      };
    }
  }
}; 