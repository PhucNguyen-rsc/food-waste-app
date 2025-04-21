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
      const user = auth.currentUser;

      // For Firebase-authenticated routes, send the Firebase token
      if (config.url?.includes('/users/payments') || config.url?.includes('/orders')) {
        if (!user) {
          throw new Error('Authentication required');
        }

        const firebaseToken = await user.getIdToken(true);
        
        // For GET requests, add token to query params
        if (config.method?.toLowerCase() === 'get') {
          config.params = {
            ...config.params,
            token: firebaseToken
          };
        } else {
          // For POST/PUT/DELETE requests, add token to body
          config.data = {
            ...config.data,
            token: firebaseToken
          };
        }
      } else if (token) {
        // For JWT-authenticated routes, send the JWT token in the header
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
      
      // If token is invalid, try to refresh it and retry the request
      if (error.response.status === 401) {
        try {
          const user = auth.currentUser;
          if (user) {
            const newToken = await user.getIdToken(true);
            const config = error.config;

            // Update token in the appropriate place based on the request type
            if (config.method?.toLowerCase() === 'get') {
              config.params = {
                ...config.params,
                token: newToken
              };
            } else {
              config.data = {
                ...config.data,
                token: newToken
              };
            }

            return api(config);
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          // Clear the stored token and redirect to login
          store.dispatch({ type: 'auth/logout' });
        }
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