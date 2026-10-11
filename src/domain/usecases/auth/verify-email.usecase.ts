import { IAuthRepository, VerifyEmailResponse } from '../../repositories/auth.repository';

export class VerifyEmailUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(token: string): Promise<VerifyEmailResponse> {
    return this.authRepository.verifyEmail(token);
  }
}

