import { UserProfile } from '../../entities/profile.entity';
import { IProfileRepository } from '../../repositories/profile.repository';

export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(): Promise<UserProfile> {
    return this.profileRepository.getProfile();
  }
}

