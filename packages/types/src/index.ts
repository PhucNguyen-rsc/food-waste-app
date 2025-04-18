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
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
} 