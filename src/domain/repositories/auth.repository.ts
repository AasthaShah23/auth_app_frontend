import {
  AuthSession,
  LoginCredentials,
  RefreshTokenResult,
  SignupCredentials,
  User,
} from '../entities/auth.entity';

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

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  signup(credentials: SignupCredentials): Promise<AuthSession>;
  refreshToken(refreshToken: string): Promise<RefreshTokenResult>;
  logout(refreshToken?: string, token?: string): Promise<void>;
  forgotPassword(email: string): Promise<ForgotPasswordResponse>;
  resetPassword(credentials: ResetPasswordCredentials): Promise<ResetPasswordResponse>;
  getMe?(token: string): Promise<User>;
}
