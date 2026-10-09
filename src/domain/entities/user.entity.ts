/**
 * Pure Domain Entity representing a User in the business domain.
 * Independent of frameworks, DB schemas, or API response formats.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  isActive: boolean;
}

