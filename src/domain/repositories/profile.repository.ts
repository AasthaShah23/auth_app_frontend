import { ProfileDTO } from '@/infrastructure/dtos/profile.dto';

export interface IProfileRepository {
  getProfile(): Promise<ProfileDTO>;
}

