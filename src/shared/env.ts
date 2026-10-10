/**
 * Centralized Application Environment Configuration
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Clean Next.js App',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;
