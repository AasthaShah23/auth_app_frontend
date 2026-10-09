import { User } from './user.entity';

/**
 * Pure Domain Entity representing Auth Session.
 */
export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

