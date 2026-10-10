import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, LoginCredentials, SignupCredentials } from '@/domain/entities/auth.entity';
import { UserProfile } from '@/domain/entities/profile.entity';
import { container } from '@/infrastructure/di/container';
import { httpClient } from '@/infrastructure/api/http-client';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initSession: () => Promise<boolean>;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  refreshAuthToken: () => Promise<string | null>;
  fetchProfile: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
}

/**
 * Sets or removes secure httpOnly cookies on the Next.js server side.
 * No tokens or user data are ever written to localStorage.
 */
async function setHttpOnlySession(token: string | null, refreshToken?: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, refreshToken }),
      });
    } else {
      await fetch('/api/session', {
        method: 'DELETE',
      });
    }
  } catch (error) {
    console.error('Error syncing httpOnly session cookie:', error);
  }
}

// Clean up any legacy localStorage data on initial load
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('app_auth_store');
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      profile: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      error: null,

      initSession: async (): Promise<boolean> => {
        if (typeof window === 'undefined') return false;
        try {
          // Verify session from server-side httpOnly cookies
          const res = await fetch('/api/session', { method: 'GET' });
          if (!res.ok) {
            set({ isInitialized: true, isAuthenticated: false });
            return false;
          }

          const data = await res.json();
          if (data?.isAuthenticated && data?.token) {
            set({
              token: data.token,
              refreshToken: data.refreshToken || null,
              isAuthenticated: true,
              isInitialized: true,
            });

            // Populate user profile in memory
            await get().fetchProfile();
            return true;
          }

          set({
            user: null,
            profile: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isInitialized: true,
          });
          return false;
        } catch (error) {
          console.error('Failed to initialize session from cookies:', error);
          set({ isInitialized: true, isAuthenticated: false });
          return false;
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await container.loginUseCase.execute(credentials);
          
          // Securely set httpOnly cookies on server (Never in localStorage)
          await setHttpOnlySession(session.token, session.refreshToken);

          // Store user details and session strictly in-memory in Zustand
          set({
            user: session.user,
            token: session.token,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
            error: null,
          });

          // Fetch latest profile into memory
          get().fetchProfile().catch(() => {});
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await container.signupUseCase.execute(credentials);
          
          // Securely set httpOnly cookies on server (Never in localStorage)
          await setHttpOnlySession(session.token, session.refreshToken);

          // Store user details in-memory in Zustand
          set({
            user: session.user,
            token: session.token,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
            error: null,
          });

          // Fetch latest profile into memory
          get().fetchProfile().catch(() => {});
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      fetchProfile: async (): Promise<UserProfile | null> => {
        try {
          // Calls GET http://127.0.0.1:8000/api/profile/me with Bearer token header
          const profile = await container.getProfileUseCase.execute();
          set({
            profile,
            user: {
              id: String(profile.id),
              fullName: profile.name,
              name: profile.name,
              email: profile.email,
              createdAt: profile.createdAt,
            },
          });
          return profile;
        } catch (error: unknown) {
          console.error('Failed to fetch user profile:', error);
          return null;
        }
      },

      refreshAuthToken: async (): Promise<string | null> => {
        let currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) {
          // Try to get from httpOnly cookie session
          try {
            const res = await fetch('/api/session');
            const data = await res.json();
            currentRefreshToken = data?.refreshToken || null;
          } catch {
            currentRefreshToken = null;
          }
        }

        if (!currentRefreshToken) {
          await get().logout();
          return null;
        }

        try {
          const result = await container.refreshTokenUseCase.execute(currentRefreshToken);
          if (result.token) {
            // Update secure httpOnly cookies
            await setHttpOnlySession(result.token, result.refreshToken || currentRefreshToken);

            set({
              token: result.token,
              refreshToken: result.refreshToken || currentRefreshToken,
              isAuthenticated: true,
            });
            return result.token;
          }
          await get().logout();
          return null;
        } catch {
          await get().logout();
          return null;
        }
      },

      logout: async () => {
        const token = get().token;
        const refreshToken = get().refreshToken;
        set({ isLoading: true, error: null });
        try {
          if (refreshToken || token) {
            await container.logoutUseCase.execute(refreshToken || undefined, token || undefined);
          }

          // Clear secure httpOnly cookies on server
          await setHttpOnlySession(null);

          // Reset strictly in-memory Zustand state
          set({
            user: null,
            profile: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Logout failed';
          set({ isLoading: false, error: message });
          // Do NOT wipe state on error so user is alerted via toast
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);

// Expose store globally in browser console for Redux DevTools & debugging
if (typeof window !== 'undefined') {
  (window as unknown as { useAuthStore: typeof useAuthStore }).useAuthStore = useAuthStore;
}

// Connect HttpClient hooks to Zustand state
httpClient.setTokenProvider(() => useAuthStore.getState().token);
httpClient.setTokenRefresher(async () => useAuthStore.getState().refreshAuthToken());
httpClient.setOnUnauthorized(() => {
  useAuthStore.getState().logout();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
});
