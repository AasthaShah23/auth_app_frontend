import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository';

/**
 * Domain Use Case: Get Users
 * Encapsulates the specific business rule/workflow to fetch users list.
 */
export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.getUsers();
    // Example domain logic: Filter out inactive users or sort by name
    return users.filter((u) => u.isActive);
  }
}

