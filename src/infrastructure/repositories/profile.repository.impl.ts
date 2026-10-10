import { UserProfile } from '@/domain/entities/profile.entity';
import { IProfileRepository } from '@/domain/repositories/profile.repository';
import { HttpClient } from '../api/http-client';
import { ProfileDTO } from '../dtos/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getProfile(): Promise<UserProfile> {
    // Calls GET http://127.0.0.1:8000/api/profile/me with Bearer token header
    const response = await this.httpClient.get<ProfileDTO>('/profile/me');
    return ProfileMapper.toDomain(response);
  }
}

