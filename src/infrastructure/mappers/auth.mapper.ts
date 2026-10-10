import { AuthSession, RefreshTokenResult, User } from '@/domain/entities/auth.entity';
import { AuthResponseDTO, RefreshResponseDTO, UserDTO } from '../dtos/auth.dto';

export class AuthMapper {
  static toUserDomain(dto?: UserDTO, fallbackEmail = ''): User {
    if (!dto) {
      return {
        id: '1',
        fullName: fallbackEmail.split('@')[0] || 'User',
        email: fallbackEmail,
        role: 'user',
      };
    }

    return {
      id: String(dto.id || dto._id || '1'),
      fullName: dto.full_name || dto.fullName || dto.name || dto.email?.split('@')[0] || 'User',
      email: dto.email || fallbackEmail,
      role: dto.role || 'user',
      createdAt: dto.created_at || dto.createdAt,
    };
  }

  static toSessionDomain(dto: AuthResponseDTO, fallbackEmail = ''): AuthSession {
    const token =
      dto.access_token ||
      dto.token ||
      dto.data?.access_token ||
      dto.data?.token ||
      '';

    const refreshToken =
      dto.refresh_token ||
      dto.refreshToken ||
      dto.data?.refresh_token ||
      dto.data?.refreshToken ||
      '';

    const userDto = dto.user || dto.data?.user;
    const user = this.toUserDomain(userDto, fallbackEmail);

    return {
      user,
      token,
      refreshToken,
    };
  }

  static toRefreshTokenResult(dto: RefreshResponseDTO): RefreshTokenResult {
    const token =
      dto.access_token ||
      dto.token ||
      dto.data?.access_token ||
      dto.data?.token ||
      '';

    const refreshToken =
      dto.refresh_token ||
      dto.refreshToken ||
      dto.data?.refresh_token ||
      dto.data?.refreshToken;

    return {
      token,
      refreshToken,
    };
  }
}
