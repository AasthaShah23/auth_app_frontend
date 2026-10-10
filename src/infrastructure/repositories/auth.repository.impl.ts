import {
  AuthSession,
  LoginCredentials,
  RefreshTokenResult,
  SignupCredentials,
  User,
} from '@/domain/entities/auth.entity';
import {
  ForgotPasswordResponse,
  IAuthRepository,
  ResetPasswordCredentials,
  ResetPasswordResponse,
} from '@/domain/repositories/auth.repository';
import { HttpClient } from '../api/http-client';
import {
  AuthResponseDTO,
  ForgotPasswordRequestDTO,
  GenericMessageResponseDTO,
  LogoutRequestDTO,
  RefreshResponseDTO,
  ResetPasswordRequestDTO,
  UserDTO,
} from '../dtos/auth.dto';
import { AuthMapper } from '../mappers/auth.mapper';

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };

    // Calls POST http://127.0.0.1:8000/api/auth/login
    const response = await this.httpClient.post<AuthResponseDTO>('/auth/login', payload);
    return AuthMapper.toSessionDomain(response, credentials.email);
  }

  async signup(credentials: SignupCredentials): Promise<AuthSession> {
    const payload = {
      fullName: credentials.fullName,
      full_name: credentials.fullName,
      email: credentials.email,
      password: credentials.password,
    };

    // Calls POST http://127.0.0.1:8000/api/auth/signup
    const response = await this.httpClient.post<AuthResponseDTO>('/auth/signup', payload);
    return AuthMapper.toSessionDomain(response, credentials.email);
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
    const payload = {
      refresh_token: refreshToken,
      refreshToken: refreshToken,
    };

    // Calls POST http://127.0.0.1:8000/api/auth/refresh
    const response = await this.httpClient.post<RefreshResponseDTO>('/auth/refresh', payload, {
      skipAuthRefresh: true,
    });
    return AuthMapper.toRefreshTokenResult(response);
  }

  async logout(refreshToken?: string, token?: string): Promise<void> {
    const payload: LogoutRequestDTO = {
      refresh_token: refreshToken,
      refreshToken: refreshToken,
    };

    // Calls POST http://127.0.0.1:8000/api/auth/logout with refresh_token in payload and token in header
    await this.httpClient.post('/auth/logout', payload, {
      token,
      skipAuthRefresh: true,
    });
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const payload: ForgotPasswordRequestDTO = {
      email,
    };

    // Calls POST http://127.0.0.1:8000/api/auth/forgot-password
    const response = await this.httpClient.post<GenericMessageResponseDTO>(
      '/auth/forgot-password',
      payload,
      { skipAuthRefresh: true }
    );

    return {
      message: response?.message || response?.detail || 'Password reset link sent to your email.',
      success: true,
    };
  }

  async resetPassword(credentials: ResetPasswordCredentials): Promise<ResetPasswordResponse> {
    const payload: ResetPasswordRequestDTO = {
      token: credentials.token,
      new_password: credentials.newPassword,
      newPassword: credentials.newPassword,
      password: credentials.newPassword,
    };

    // Calls POST http://127.0.0.1:8000/api/auth/reset-password
    const response = await this.httpClient.post<GenericMessageResponseDTO>(
      '/auth/reset-password',
      payload,
      { skipAuthRefresh: true }
    );

    return {
      message: response?.message || response?.detail || 'Password reset successfully.',
      success: true,
    };
  }

  async getMe(token: string): Promise<User> {
    const response = await this.httpClient.get<UserDTO>('/auth/me', { token });
    return AuthMapper.toUserDomain(response);
  }
}
