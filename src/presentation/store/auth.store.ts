import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, SignupCredentials } from '@/domain/entities/auth.entity';
import { container } from '@/infrastructure/di/container';
import { httpClient } from '@/infrastructure/api/http-client';
import { APP_CONSTANTS } from '@/shared/app.constants';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  refreshAuthToken: () => Promise<string | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  syncSessionCookies: (token: string | null, refreshToken?: string | null) => Promise<void>;
}

/**
 * Sets or removes secure httpOnly cookies on the Next.js server side.
 * This prevents XSS attacks from accessing sensitive JWT tokens.
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await container.loginUseCase.execute(credentials);
          
          // Securely set httpOnly cookies on server
          await setHttpOnlySession(session.token, session.refreshToken);

          // Store user details and session state in Zustand
          set({
            user: session.user,
            token: session.token,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
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
          
          // Securely set httpOnly cookies on server
          await setHttpOnlySession(session.token, session.refreshToken);

          // Store user details in Zustand
          set({
            user: session.user,
            token: session.token,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      refreshAuthToken: async (): Promise<string | null> => {
        const currentRefreshToken = get().refreshToken;
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

          // Reset user details & authentication state in Zustand
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Logout failed';
          set({ isLoading: false, error: message });
          // Do NOT log out or wipe state on error so user is alerted via toast
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      syncSessionCookies: async (token: string | null, refreshToken?: string | null) => {
        await setHttpOnlySession(token, refreshToken);
      },
    }),
    {
      name: APP_CONSTANTS.STORAGE_KEYS.AUTH_STORE,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => null,
              removeItem: () => null,
            }
      ),
      // Persist user details and session state in Zustand
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setHttpOnlySession(state.token, state.refreshToken);
        }
      },
    }
  )
);

// Connect HttpClient hooks to Zustand state
httpClient.setTokenProvider(() => useAuthStore.getState().token);
httpClient.setTokenRefresher(async () => useAuthStore.getState().refreshAuthToken());
httpClient.setOnUnauthorized(() => {
  useAuthStore.getState().logout();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
});
