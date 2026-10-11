import {
  AuthSession,
  SignupCredentials,
  User,
} from "@/domain/entities/auth.entity";
import {
  ForgotPasswordResponse,
  IAuthRepository,
  ResetPasswordCredentials,
  ResetPasswordResponse,
  ResendVerificationResponse,
  VerifyEmailResponse,
} from "@/domain/repositories/auth.repository";
import { HttpClient } from "../api/http-client";
import {
  AuthResponseDTO,
  ForgotPasswordRequestDTO,
  GenericMessageResponseDTO,
  LoginRequestDTO,
  LogoutRequestDTO,
  RefreshResponseDTO,
  ResetPasswordRequestDTO,
  SignupRequestDTO,
  UserDTO,
} from "../dtos/auth.dto";

function toUser(dto?: UserDTO): User {
  return {
    id: String(dto?.id ?? ""),
    name: dto?.name || "",
    email: dto?.email || "",
    role: (dto?.role || "user").toLowerCase(),
  };
}

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async login(credentials: LoginRequestDTO): Promise<AuthSession> {
    const payload: LoginRequestDTO = {
      email: credentials.email,
      password: credentials.password,
    };

    // Calls POST /auth/login
    const response = await this.httpClient.post<AuthResponseDTO>(
      "/auth/login",
      payload,
    );
    console.log("AuthRepositoryImpl login response:", response);
    const userDto = response.user;
    return {
      user: toUser(userDto),
      token: response.access_token,
      refreshToken: response.refresh_token,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthSession> {
    const name = credentials.name || credentials.fullName || "";

    const payload: SignupRequestDTO = {
      name,
      email: credentials.email,
      password: credentials.password,
    };

    // Calls POST /auth/signup
    const response = await this.httpClient.post<AuthResponseDTO>(
      "/auth/signup",
      payload,
    );
    const userDto = response.user;
    return {
      user: toUser(userDto),
      token: response.access_token,
      refreshToken: response.refresh_token,
    };
  }

  async refreshToken(refreshToken?: string): Promise<AuthSession> {
    const payload = refreshToken ? { refresh_token: refreshToken } : undefined;

    // Calls POST /auth/refresh with credentials: 'include'
    const response = await this.httpClient.post<RefreshResponseDTO>(
      "/auth/refresh",
      payload,
      {
        skipAuthRefresh: true,
      },
    );
    const userDto = response.user || response.data?.user;
    return {
      user: toUser(userDto),
      token:
        response.access_token ||
        response.token ||
        response.data?.access_token ||
        "",
      refreshToken:
        response.refresh_token ||
        response.refreshToken ||
        response.data?.refresh_token ||
        "",
    };
  }

  async logout(refreshToken?: string, token?: string): Promise<void> {
    const payload = refreshToken ? { refresh_token: refreshToken } : undefined;

    // Calls POST http://127.0.0.1:8000/api/auth/logout with credentials: 'include'
    await this.httpClient.post("/auth/logout", payload, {
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
      "/auth/forgot-password",
      payload,
      { skipAuthRefresh: true },
    );

    return {
      message:
        response?.message ||
        response?.detail ||
        "Password reset link sent to your email.",
      success: true,
    };
  }

  async resetPassword(
    credentials: ResetPasswordCredentials,
  ): Promise<ResetPasswordResponse> {
    const payload: ResetPasswordRequestDTO = {
      token: credentials.token,
      new_password: credentials.newPassword,
      newPassword: credentials.newPassword,
      password: credentials.newPassword,
    };

    // Calls POST http://127.0.0.1:8000/api/auth/reset-password
    const response = await this.httpClient.post<GenericMessageResponseDTO>(
      "/auth/reset-password",
      payload,
      { skipAuthRefresh: true },
    );

    return {
      message:
        response?.message || response?.detail || "Password reset successfully.",
      success: true,
    };
  }

  async resendVerification(
    email?: string,
  ): Promise<ResendVerificationResponse> {
    const payload = {
      email: email,
    };

    // Calls POST http://127.0.0.1:8000/api/auth/resend-verification with payload { email }
    const response = await this.httpClient.post<GenericMessageResponseDTO>(
      "/auth/resend-verification",
      payload,
    );

    return {
      message: response?.message || "Verification email sent successfully.",
    };
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      // Primary: GET /auth/verify-email?token=...
      const response = await this.httpClient.get<GenericMessageResponseDTO>(
        `/auth/verify-email?token=${encodeURIComponent(token)}`,
        { skipAuthRefresh: true },
      );
      return {
        message:
          response?.message ||
          response?.detail ||
          "Email verified successfully.",
        success: true,
      };
    } catch (err: unknown) {
      // Fallback: POST /auth/verify-email with payload { token }
      try {
        const response = await this.httpClient.post<GenericMessageResponseDTO>(
          "/auth/verify-email",
          { token },
          { skipAuthRefresh: true },
        );
        return {
          message:
            response?.message ||
            response?.detail ||
            "Email verified successfully.",
          success: true,
        };
      } catch {
        throw err;
      }
    }
  }
}
