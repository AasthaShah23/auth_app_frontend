export interface User {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface RefreshTokenResult {
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
}
