export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface SignupRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface RefreshRequestDTO {
  refresh_token?: string;
}

export interface LogoutRequestDTO {
  refresh_token?: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResendVerificationRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  new_password?: string;
  newPassword?: string;
  password?: string;
}

export interface GenericMessageResponseDTO {
  message?: string;
  detail?: string;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponseDTO {
  access_token: string;
  refresh_token: string;
  user: UserDTO;
  message?: string;
}

export interface RefreshResponseDTO {
  access_token?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  token_type?: string;
  role?: string;
  user?: UserDTO;
  data?: {
    token?: string;
    access_token?: string;
    refresh_token?: string;
    refreshToken?: string;
    role?: string;
    user?: UserDTO;
  };
}
