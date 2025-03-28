export interface ApiConfigOptions {
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

export interface AuthConfigOptions {
  jwtExpiry?: number;
  refreshTokenExpiry?: number;
  isProduction?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  cookiePath?: string;
}

export interface UploadConfigOptions {
  maxFileSize?: number;
  allowedFileTypes?: string[];
  maxFiles?: number;
}

export interface PaginationConfigOptions {
  defaultPageSize?: number;
  maxPageSize?: number;
}

export interface CacheConfigOptions {
  ttl?: number;
  maxItems?: number;
}

export interface ApiConfig {
  BASE_URL: string;
  PORT: number;
  TIMEOUT: number;
  HEADERS: {
    'Content-Type': string;
    [key: string]: string;
  };
  CORS: {
    ORIGINS: string[];
    METHODS: string[];
    CREDENTIALS: boolean;
    ALLOWED_HEADERS: string[];
  };
}

export interface AuthConfig {
  JWT_EXPIRY: number;
  REFRESH_TOKEN_EXPIRY: number;
  COOKIE_OPTIONS: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
  };
  SECRET: string;
}

export interface UploadConfig {
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
  MAX_FILES: number;
}

export interface PaginationConfig {
  DEFAULT_PAGE_SIZE: number;
  MAX_PAGE_SIZE: number;
}

export interface CacheConfig {
  TTL: number;
  MAX_ITEMS: number;
}

export declare function getApiConfig(options?: ApiConfigOptions): ApiConfig;
export declare function getAuthConfig(secret?: string, options?: AuthConfigOptions): AuthConfig;
export declare function getUploadConfig(options?: UploadConfigOptions): UploadConfig;
export declare function getPaginationConfig(options?: PaginationConfigOptions): PaginationConfig;
export declare function getCacheConfig(options?: CacheConfigOptions): CacheConfig; 