// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  // Business specific fields
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  // Consumer specific fields
  deliveryAddress?: string;
  // Courier specific fields
  isAvailable?: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  vehicleType?: VehicleType;
}

export enum UserRole {
  BUSINESS = "BUSINESS",
  CONSUMER = "CONSUMER",
  COURIER = "COURIER",
  ADMIN = "ADMIN",
  UNASSIGNED = "UNASSIGNED"
}

export enum VehicleType {
  BIKE = 'BIKE',
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  VAN = 'VAN',
}

// Food item types
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  quantity: number;
  expiryDate: Date;
  businessId: string;
  images: string[];
  category: FoodCategory;
  status: FoodStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum FoodCategory {
  MEAT = 'MEAT',
  DAIRY = 'DAIRY',
  PRODUCE = 'PRODUCE',
  BAKERY = 'BAKERY',
  PREPARED = 'PREPARED',
  OTHER = 'OTHER'
}

export enum FoodStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED'
}

// Order types
export interface Order {
  id: string;
  consumerId: string;
  businessId: string;
  courierId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  foodItemId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',           // Initial state when order is created
  BUSINESS_CONFIRMED = 'BUSINESS_CONFIRMED', // Business has confirmed the order
  CONFIRMED = 'CONFIRMED',       // Courier has accepted the order
  PREPARING = 'PREPARING',       // Business is preparing the order
  READY = 'READY',              // Order is ready for pickup
  PICKED_UP = 'PICKED_UP',      // Courier has picked up the order
  COURIER_DELIVERED = 'COURIER_DELIVERED', // Courier has marked as delivered, waiting for consumer confirmation
  DELIVERED = 'DELIVERED',       // Consumer has confirmed delivery
  CANCELLED = 'CANCELLED'        // Order was cancelled
}

export enum PaymentType {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  PAYPAL = 'PAYPAL'
} 