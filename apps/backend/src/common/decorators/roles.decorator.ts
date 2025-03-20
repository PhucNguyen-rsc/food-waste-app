import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@food-waste/database';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles); 