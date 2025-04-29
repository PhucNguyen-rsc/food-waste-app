import { User } from './index';

export interface CourierUser extends User {
  phone?: string;
  vehicleNumber?: string;
}

export type VehicleType = 'BICYCLE' | 'MOTORCYCLE' | 'CAR' | 'VAN'; 