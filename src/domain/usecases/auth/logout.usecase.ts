import { IAuthRepository } from "../../repositories/auth.repository";

export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(refreshToken?: string, token?: string): Promise<void> {
    return this.authRepository.logout(refreshToken, token);
  }
}
