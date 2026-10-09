import { User } from '@domain/entities/user.entity';
import { UserDTO } from '../dtos/user.dto';

export class UserMapper {
  static toDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      name: dto.full_name,
      email: dto.email_address,
      role: (dto.user_role as User['role']) || 'user',
      createdAt: new Date(dto.created_at),
      isActive: dto.is_active,
    };
  }

  static toDTO(entity: User): UserDTO {
    return {
      id: entity.id,
      full_name: entity.name,
      email_address: entity.email,
      user_role: entity.role,
      created_at: entity.createdAt.toISOString(),
      is_active: entity.isActive,
    };
  }
}

