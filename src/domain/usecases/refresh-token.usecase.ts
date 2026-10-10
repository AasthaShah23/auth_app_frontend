import { RefreshTokenResult } from '../entities/auth.entity';
import { IAuthRepository } from '../repositories/auth.repository';

export class RefreshTokenUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(refreshToken: string): Promise<RefreshTokenResult> {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    return this.authRepository.refreshToken(refreshToken);
  }
}

