// API configuration
const API_CONFIG = {
  BASE_URL: process.env.API_URL || 'http://localhost:3001',
  PORT: parseInt(process.env.PORT || '3001', 10),
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Authentication configuration
const AUTH_CONFIG = {
  JWT_EXPIRY: 24 * 60 * 60, // 24 hours in seconds
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
};

// File upload configuration
const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
};

// Pagination configuration
const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Cache configuration
const CACHE_CONFIG = {
  TTL: 60 * 60 * 1000, // 1 hour
  MAX_ITEMS: 1000,
};

module.exports = {
  API_CONFIG,
  AUTH_CONFIG,
  UPLOAD_CONFIG,
  PAGINATION_CONFIG,
  CACHE_CONFIG,
}; 