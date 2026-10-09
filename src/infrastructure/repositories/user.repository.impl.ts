import { User } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository';
import { HttpClient } from '../api/http-client';
import { UserDTO } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';

/**
 * Concrete implementation of IUserRepository interface using API / HttpClient or Mock fallback.
 */
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getUsers(): Promise<User[]> {
    try {
      const dtos = await this.httpClient.get<UserDTO[]>('/users');
      return dtos.map(UserMapper.toDomain);
    } catch {
      // Fallback mock data when API is not available during dev
      return this.getMockUsers();
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const dto = await this.httpClient.get<UserDTO>(`/users/${id}`);
      return UserMapper.toDomain(dto);
    } catch {
      const mock = this.getMockUsers().find((u) => u.id === id);
      return mock || null;
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const payload = {
      full_name: userData.name,
      email_address: userData.email,
      user_role: userData.role,
      is_active: userData.isActive,
    };
    const dto = await this.httpClient.post<UserDTO>('/users', payload);
    return UserMapper.toDomain(dto);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const dto = await this.httpClient.put<UserDTO>(`/users/${id}`, user);
    return UserMapper.toDomain(dto);
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.httpClient.delete(`/users/${id}`);
    return true;
  }

  private getMockUsers(): User[] {
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        createdAt: new Date(),
        isActive: true,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        createdAt: new Date(),
        isActive: true,
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        createdAt: new Date(),
        isActive: true,
      },
    ];
  }
}

