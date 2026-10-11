export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}
