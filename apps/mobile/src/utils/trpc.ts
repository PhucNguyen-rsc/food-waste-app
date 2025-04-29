import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@food-waste-app/backend';

export const trpc = createTRPCReact<AppRouter>();

export const API_URL = __DEV__ 
  ? 'http://localhost:3001/trpc'
  : 'https://your-production-url.com/trpc'; // Update this with your production URL 