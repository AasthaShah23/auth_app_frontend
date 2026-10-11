import { env } from '@/shared/env';
import { AppError } from '@/shared/app-error';

export interface HttpRequestOptions extends RequestInit {
  params?: Record<string, string>;
  token?: string;
  skipAuthRefresh?: boolean;
  _retry?: boolean;
}

export type TokenProvider = () => string | null;
export type TokenRefresher = () => Promise<boolean | string | null>;
export type UnauthorizedHandler = () => void;

export class HttpClient {
  private baseUrl: string;
  private tokenProvider: TokenProvider | null = null;
  private tokenRefresher: TokenRefresher | null = null;
  private onUnauthorized: UnauthorizedHandler | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean | string | null> | null = null;

  constructor(baseUrl: string = env.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setTokenProvider(provider: TokenProvider) {
    this.tokenProvider = provider;
  }

  setTokenRefresher(refresher: TokenRefresher) {
    this.tokenRefresher = refresher;
  }

  setOnUnauthorized(handler: UnauthorizedHandler) {
    this.onUnauthorized = handler;
  }

  async get<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  private async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${this.baseUrl}${formattedPath}`;

    if (options.params) {
      const searchParams = new URLSearchParams(options.params);
      url += `?${searchParams.toString()}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Auto-attach bearer token if not explicitly provided
    const token = options.token || (this.tokenProvider ? this.tokenProvider() : null);
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        credentials: 'include',
        ...options,
        headers,
      });

      // Handle 401 Unauthorized with Automatic Token Refresh & Retry
      if (response.status === 401 && !options.skipAuthRefresh && !options._retry && this.tokenRefresher) {
        try {
          const refreshed = await this.getOrRefreshToken();
          if (refreshed) {
            return this.request<T>(path, {
              ...options,
              _retry: true,
              token: typeof refreshed === 'string' ? refreshed : undefined,
            });
          }
        } catch {
          if (this.onUnauthorized) {
            this.onUnauthorized();
          }
        }
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let message = 'API request failed';
        if (data) {
          if (typeof data.detail === 'string') {
            message = data.detail;
          } else if (Array.isArray(data.detail) && data.detail[0]?.msg) {
            message = data.detail[0].msg;
          } else if (data.message) {
            message = data.message;
          } else if (data.error) {
            message = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
          }
        }

        throw new AppError(message || response.statusText, response.status);
      }

      return data as T;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const isConnectionError = error instanceof TypeError && error.message.includes('fetch');
      throw new AppError(
        isConnectionError
          ? `Could not connect to backend server at ${this.baseUrl}. Please make sure your backend is running.`
          : error instanceof Error
          ? error.message
          : 'Network failure',
        500
      );
    }
  }

  // Mutex pattern to ensure only 1 refresh request is made for concurrent 401s
  private async getOrRefreshToken(): Promise<boolean | string | null> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshPromise = (async () => {
        try {
          if (this.tokenRefresher) {
            return await this.tokenRefresher();
          }
          return null;
        } finally {
          this.isRefreshing = false;
          this.refreshPromise = null;
        }
      })();
    }

    return this.refreshPromise;
  }
}

export const httpClient = new HttpClient();
