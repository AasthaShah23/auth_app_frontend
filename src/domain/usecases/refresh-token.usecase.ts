import { AuthSession } from "../entities/auth.entity";
import { IAuthRepository } from "../repositories/auth.repository";

export class RefreshTokenUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(refreshToken?: string): Promise<AuthSession> {
    return this.authRepository.refreshToken(refreshToken);
  }
}
