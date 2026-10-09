/**
 * Centralized Application Environment Configuration
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com/v1',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Clean Next.js App',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;

