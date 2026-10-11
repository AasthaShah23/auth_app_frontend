import { LoginUseCase } from '@/domain/usecases/login.usecase';
import { SignupUseCase } from '@/domain/usecases/signup.usecase';
import { LogoutUseCase } from '@/domain/usecases/logout.usecase';
import { RefreshTokenUseCase } from '@/domain/usecases/refresh-token.usecase';
import { ForgotPasswordUseCase } from '@/domain/usecases/forgot-password.usecase';
import { ResetPasswordUseCase } from '@/domain/usecases/reset-password.usecase';
import { GetProfileUseCase } from '@/domain/usecases/profile/get-profile.usecase';
import { ResendVerificationUseCase } from '@/domain/usecases/auth/resend-verification.usecase';
import { VerifyEmailUseCase } from '@/domain/usecases/auth/verify-email.usecase';
import { httpClient } from '../api/http-client';
import { AuthRepositoryImpl } from '../repositories/auth.repository.impl';
import { ProfileRepositoryImpl } from '../repositories/profile.repository.impl';

class Container {
  // Infrastructure Repositories
  public authRepository = new AuthRepositoryImpl(httpClient);
  public profileRepository = new ProfileRepositoryImpl(httpClient);

  // Domain Use Cases
  public loginUseCase = new LoginUseCase(this.authRepository);
  public signupUseCase = new SignupUseCase(this.authRepository);
  public logoutUseCase = new LogoutUseCase(this.authRepository);
  public refreshTokenUseCase = new RefreshTokenUseCase(this.authRepository);
  public forgotPasswordUseCase = new ForgotPasswordUseCase(this.authRepository);
  public resetPasswordUseCase = new ResetPasswordUseCase(this.authRepository);
  public getProfileUseCase = new GetProfileUseCase(this.profileRepository);
  public resendVerificationUseCase = new ResendVerificationUseCase(this.authRepository);
  public verifyEmailUseCase = new VerifyEmailUseCase(this.authRepository);
}

export const container = new Container();
