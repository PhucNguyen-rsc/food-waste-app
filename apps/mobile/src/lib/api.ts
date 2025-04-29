import axios from 'axios';
import { store } from '../store';

// API configuration function
const getApiConfig = (config = {}) => {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const mobileAppUrl = process.env.MOBILE_APP_URL || 'http://localhost:19006';
  
  return {
    baseURL: apiUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
    ...config,
  };
};

// Create an axios instance with the API configuration
const api = axios.create(getApiConfig());

// Request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    // Get the token from Redux store
    const { auth } = store.getState();
    const token = auth?.token;
    
    // If token exists and this is an authenticated route, add it to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the API error
    console.error('API Error:', error);
    
    // Handle 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Clear the token and log out
      store.dispatch({ type: 'auth/clearToken' });
    }
    
    return Promise.reject(error);
  }
);

export default api;