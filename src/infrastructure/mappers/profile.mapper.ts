import { UserProfile } from '@/domain/entities/profile.entity';
import { ProfileDTO } from '../dtos/profile.dto';

export class ProfileMapper {
  static toDomain(dto: ProfileDTO): UserProfile {
    return {
      id: dto.id ?? 0,
      name: dto.name || dto.full_name || dto.fullName || dto.email.split('@')[0],
      email: dto.email,
      isEmailVerified: dto.is_email_verified ?? dto.isEmailVerified ?? true,
      isActive: dto.is_active ?? dto.isActive ?? true,
      createdAt: dto.created_at || dto.createdAt || new Date().toISOString(),
    };
  }
}

