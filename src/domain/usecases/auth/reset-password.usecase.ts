import {
  IAuthRepository,
  ResetPasswordCredentials,
  ResetPasswordResponse,
} from "../../repositories/auth.repository";

export class ResetPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(
    credentials: ResetPasswordCredentials,
  ): Promise<ResetPasswordResponse> {
    if (!credentials.token) {
      throw new Error("Reset token is missing or invalid");
    }
    if (!credentials.newPassword) {
      throw new Error("New password is required");
    }
    return this.authRepository.resetPassword(credentials);
  }
}
