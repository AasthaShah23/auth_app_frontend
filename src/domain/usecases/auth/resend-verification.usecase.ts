import { IAuthRepository, ResendVerificationResponse } from '../../repositories/auth.repository';

export class ResendVerificationUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email?: string): Promise<ResendVerificationResponse> {
    return this.authRepository.resendVerification(email);
  }
}

