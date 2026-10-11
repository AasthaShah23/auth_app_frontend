import { AuthSession, LoginCredentials } from "../../entities/auth.entity";
import { IAuthRepository } from "../../repositories/auth.repository";

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthSession> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }
    return this.authRepository.login(credentials);
  }
}
