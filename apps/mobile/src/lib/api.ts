import axios from 'axios';
import { getApiConfig } from '@food-waste/config';

const apiConfig = getApiConfig({
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001',
  mobileAppUrl: process.env.EXPO_PUBLIC_MOBILE_APP_URL || 'http://localhost:3002',
});

// Create axios instance with default config
const api = axios.create({
  baseURL: apiConfig.BASE_URL,
  timeout: apiConfig.TIMEOUT,
  headers: apiConfig.HEADERS,
  withCredentials: apiConfig.CORS.CREDENTIALS,
});

// Add request interceptor for auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else went wrong
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 