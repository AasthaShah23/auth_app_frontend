import { User } from '../entities/user.entity';

/**
 * Domain Repository Interface (Contract) for User data operations.
 * Defines operations required by the domain without exposing implementation details.
 */
export interface IUserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
}

