import { UserProfile } from '../entities/profile.entity';

export interface IProfileRepository {
  getProfile(): Promise<UserProfile>;
}

