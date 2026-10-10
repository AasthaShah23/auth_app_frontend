export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface SignupRequestDTO {
  full_name?: string;
  fullName?: string;
  name?: string;
  email: string;
  password: string;
}

export interface RefreshRequestDTO {
  refresh_token?: string;
  refreshToken?: string;
}

export interface LogoutRequestDTO {
  refresh_token?: string;
  refreshToken?: string;
}

export interface ForgotPasswordRequestDTO {
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
  success?: boolean;
}

export interface UserDTO {
  id?: string | number;
  _id?: string;
  email: string;
  full_name?: string;
  fullName?: string;
  name?: string;
  role?: string;
  created_at?: string;
  createdAt?: string;
}

export interface AuthResponseDTO {
  access_token?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  token_type?: string;
  user?: UserDTO;
  data?: {
    token?: string;
    access_token?: string;
    refresh_token?: string;
    refreshToken?: string;
    user?: UserDTO;
  };
  message?: string;
}

export interface RefreshResponseDTO {
  access_token?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  token_type?: string;
  data?: {
    token?: string;
    access_token?: string;
    refresh_token?: string;
    refreshToken?: string;
  };
}
