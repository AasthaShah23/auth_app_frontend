import { ForgotPasswordResponse, IAuthRepository } from '../repositories/auth.repository';

export class ForgotPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string): Promise<ForgotPasswordResponse> {
    if (!email) {
      throw new Error('Email is required');
    }
    return this.authRepository.forgotPassword(email);
  }
}

