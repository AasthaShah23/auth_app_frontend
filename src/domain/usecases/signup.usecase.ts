import { AuthSession, SignupCredentials } from '../entities/auth.entity';
import { IAuthRepository } from '../repositories/auth.repository';

export class SignupUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: SignupCredentials): Promise<AuthSession> {
    if (!credentials.fullName || !credentials.email || !credentials.password) {
      throw new Error('Full name, email, and password are required');
    }
    return this.authRepository.signup(credentials);
  }
}

