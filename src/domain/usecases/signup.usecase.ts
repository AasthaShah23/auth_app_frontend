import { AuthSession, SignupCredentials } from '../entities/auth.entity';
import { IAuthRepository } from '../repositories/auth.repository';

export class SignupUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: SignupCredentials): Promise<AuthSession> {
    const name = credentials.name || credentials.fullName || '';
    if (!name || !credentials.email || !credentials.password) {
      throw new Error('Name, email, and password are required');
    }
    return this.authRepository.signup({
      name,
      fullName: name,
      email: credentials.email,
      password: credentials.password,
    });
  }
}

