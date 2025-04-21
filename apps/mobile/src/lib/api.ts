import axios, { InternalAxiosRequestConfig } from 'axios';
import { getApiConfig } from '@food-waste/config';
import { store } from '@/store';
import { auth } from '@/config/firebaseConfig';

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

// Add request interceptor for auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const state = store.getState();
      const token = state.auth.token;

      // For all authenticated routes, send the JWT token in the header
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      
      if (error.response.status === 401) {
        // Clear the stored token and redirect to login
        store.dispatch({ type: 'auth/logout' });
      }
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