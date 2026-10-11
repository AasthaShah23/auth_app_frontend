import { ProfileDTO } from '@/infrastructure/dtos/profile.dto';
import { IProfileRepository } from '../../repositories/profile.repository';

export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(): Promise<ProfileDTO> {
    return this.profileRepository.getProfile();
  }
}

