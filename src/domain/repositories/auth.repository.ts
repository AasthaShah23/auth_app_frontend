import {
  AuthSession,
  LoginCredentials,
  SignupCredentials,
} from "../entities/auth.entity";

export interface ForgotPasswordResponse {
  message?: string;
  success?: boolean;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message?: string;
  success?: boolean;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
  success?: boolean;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  signup(credentials: SignupCredentials): Promise<AuthSession>;
  refreshToken(refreshToken?: string): Promise<AuthSession>;
  logout(refreshToken?: string, token?: string): Promise<void>;
  forgotPassword(email: string): Promise<ForgotPasswordResponse>;
  resetPassword(
    credentials: ResetPasswordCredentials,
  ): Promise<ResetPasswordResponse>;
  resendVerification(email?: string): Promise<ResendVerificationResponse>;
  verifyEmail(token: string): Promise<VerifyEmailResponse>;
}
