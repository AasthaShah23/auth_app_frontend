/**
 * Centralized Application Environment Configuration
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
} as const;
