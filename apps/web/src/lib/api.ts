import axios from 'axios'
const { getApiConfig } = require('@food-waste/config');
import { getSession } from 'next-auth/react'

const API_CONFIG = getApiConfig();

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
})

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
  try {
    const session = await getSession()
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    } else {
      console.warn('No authentication token found in session')
    }
    return config
  } catch (error) {
    console.error('Error getting session:', error)
    return config
  }
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access:', error.response.data)
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
) 