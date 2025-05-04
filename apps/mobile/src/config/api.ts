
export const API_ENDPOINTS = {
  CONSUMER: {
    ORDERS: '/consumer/orders',
    CONFIRM_DELIVERY: (orderId: string) => `/consumer/orders/${orderId}/confirm`,
  },
  COURIER: {
    DELIVERY_REQUESTS: '/courier/delivery-requests',
    ACTIVE_DELIVERY: '/courier/active-delivery',
    UPDATE_DELIVERY_STATUS: (deliveryId: string) => 
      `/courier/deliveries/${deliveryId}/status`,
    STATS: '/courier/stats',
    NEW_REQUESTS: '/courier/new-requests',
    HISTORY: '/courier/history',
    PROFILE: '/courier/profile',
    EARNINGS: '/courier/earnings',
    ACCEPT_DELIVERY: (deliveryId: string) =>
      `/courier/deliveries/${deliveryId}/accept`,
    DELIVERY_DETAILS: (deliveryId: string) =>
      `/courier/deliveries/${deliveryId}`,
  },
};

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleApiError = (error: any): APIError => {
  if (error instanceof APIError) {
    return error;
  }
  
  if (error.response) {
    return new APIError(
      error.response.data?.message || 'An error occurred',
      error.response.status,
      error.response.data
    );
  }
  
  return new APIError('Network error occurred');
}; 