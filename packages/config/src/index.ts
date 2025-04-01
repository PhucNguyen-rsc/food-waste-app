/**
 * @typedef {Object} ApiConfigOptions
 * @property {string} [apiUrl]
 * @property {string|number} [port]
 * @property {number} [timeout]
 * @property {Record<string,string>} [headers]
 * @property {string} [frontendUrl]
 * @property {string} [mobileAppUrl]
 * @property {string[]} [methods]
 * @property {boolean} [credentials]
 * @property {string[]} [allowedHeaders]
 */

/**
 * @typedef {Object} AuthConfigOptions
 * @property {number} [jwtExpiry]
 * @property {number} [refreshTokenExpiry]
 * @property {boolean} [isProduction]
 * @property {'strict'|'lax'|'none'} [sameSite]
 * @property {string} [cookiePath]
 */

/**
 * @typedef {Object} UploadConfigOptions
 * @property {number} [maxFileSize]
 * @property {string[]} [allowedFileTypes]
 * @property {number} [maxFiles]
 */

/**
 * @typedef {Object} PaginationConfigOptions
 * @property {number} [defaultPageSize]
 * @property {number} [maxPageSize]
 */

/**
 * @typedef {Object} CacheConfigOptions
 * @property {number} [ttl]
 * @property {number} [maxItems]
 */

// Type definitions
interface ApiConfigOptions {
  apiUrl?: string;
  port?: string | number;
  timeout?: number;
  headers?: Record<string, string>;
  frontendUrl?: string;
  mobileAppUrl?: string;
  methods?: string[];
  credentials?: boolean;
  allowedHeaders?: string[];
}

interface AuthConfigOptions {
  jwtExpiry?: number;
  refreshTokenExpiry?: number;
  isProduction?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  cookiePath?: string;
}

interface UploadConfigOptions {
  maxFileSize?: number;
  allowedFileTypes?: string[];
  maxFiles?: number;
}

interface PaginationConfigOptions {
  defaultPageSize?: number;
  maxPageSize?: number;
}

interface CacheConfigOptions {
  ttl?: number;
  maxItems?: number;
}

// API configuration
const getApiConfig = (options: ApiConfigOptions = {}) => ({
  BASE_URL: options.apiUrl || process.env.API_URL || 'http://localhost:3001',
  PORT: parseInt(String(options.port || process.env.PORT || '3001'), 10),
  TIMEOUT: options.timeout || 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    ...options.headers,
  },
  CORS: {
    ORIGINS: [
      options.frontendUrl || process.env.FRONTEND_URL || 'http://localhost:3000',
      options.mobileAppUrl || process.env.MOBILE_APP_URL || 'http://localhost:3002',
      process.env.NGROK_URL, // ✅ Allow ngrok URL
    ].filter(Boolean),
    METHODS: options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    CREDENTIALS: options.credentials !== undefined ? options.credentials : true,
    ALLOWED_HEADERS: options.allowedHeaders || [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  },
});

// Authentication configuration
const getAuthConfig = (secret = 'default-unsafe-secret', options: AuthConfigOptions = {}) => ({
  JWT_EXPIRY: options.jwtExpiry || 24 * 60 * 60, // 24 hours in seconds
  REFRESH_TOKEN_EXPIRY: options.refreshTokenExpiry || 7 * 24 * 60 * 60, // 7 days in seconds
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: options.isProduction || process.env.NODE_ENV === 'production',
    sameSite: options.sameSite || 'lax',
    path: options.cookiePath || '/',
  },
  SECRET: secret,
});

// File upload configuration
const getUploadConfig = (options: UploadConfigOptions = {}) => ({
  MAX_FILE_SIZE: options.maxFileSize || 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: options.allowedFileTypes || ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: options.maxFiles || 5,
});

// Pagination configuration
const getPaginationConfig = (options: PaginationConfigOptions = {}) => ({
  DEFAULT_PAGE_SIZE: options.defaultPageSize || 10,
  MAX_PAGE_SIZE: options.maxPageSize || 100,
});

// Cache configuration
const getCacheConfig = (options: CacheConfigOptions = {}) => ({
  TTL: options.ttl || 60 * 60 * 1000, // 1 hour
  MAX_ITEMS: options.maxItems || 1000,
});

// Export all configuration functions
export {
  getApiConfig,
  getAuthConfig,
  getUploadConfig,
  getPaginationConfig,
  getCacheConfig,
};

// Export types
export type {
  ApiConfigOptions,
  AuthConfigOptions,
  UploadConfigOptions,
  PaginationConfigOptions,
  CacheConfigOptions,
};
