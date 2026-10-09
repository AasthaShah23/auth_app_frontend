import { AuthSession, LoginCredentials } from '../entities/auth.entity';

/**
 * Domain Repository Interface (Contract) for Authentication.
 */
export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
}

