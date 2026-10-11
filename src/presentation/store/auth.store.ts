import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  User,
  LoginCredentials,
  SignupCredentials,
} from "@/domain/entities/auth.entity";
import { ProfileDTO } from "@/infrastructure/dtos/profile.dto";
import { container } from "@/infrastructure/di/container";
import { httpClient } from "@/infrastructure/api/http-client";

interface AuthState {
  user: User | null;
  profile: ProfileDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  refreshAuthToken: () => Promise<boolean>;
  fetchProfile: () => Promise<ProfileDTO | null>;
  resendVerificationEmail: (email?: string) => Promise<string>;
  verifyEmail: (token: string) => Promise<string>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfile: (profile: ProfileDTO | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const session = await container.loginUseCase.execute(credentials);
          set({
            user: session.user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch profile details
          get()
            .fetchProfile()
            .catch(() => {});
        } catch (error) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ isLoading: true });
        try {
          const session = await container.signupUseCase.execute(credentials);
          set({
            user: session.user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Fetch profile details
          get()
            .fetchProfile()
            .catch(() => {});
        } catch (error) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      fetchProfile: async (): Promise<ProfileDTO | null> => {
        try {
          const profile = await container.getProfileUseCase.execute();
          if (profile) {
            set((state) => ({
              profile,
              user: state.user || {
                id: String(profile.id),
                name: profile.name,
                email: profile.email,
                role: "user",
              },
            }));
          }
          return profile;
        } catch {
          return null;
        }
      },

      checkAuth: async (): Promise<boolean> => {
        set({ isLoading: true });
        try {
          // 1. Primary session endpoint: GET /api/profile/me using HttpOnly cookie
          const profile = await container.getProfileUseCase.execute();
          if (profile) {
            const user: User = {
              id: String(profile.id),
              name: profile.name,
              email: profile.email,
              role: (get().user?.role || "user").toLowerCase(),
            };
            set({
              user,
              profile,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
        } catch {
          // 2. Fallback: if access_token expired or user unverified, refresh session via HttpOnly refresh cookie
          try {
            const session = await container.refreshTokenUseCase.execute();
            if (session?.user) {
              set({
                user: session.user,
                isAuthenticated: true,
                isLoading: false,
              });

              // Background fetch profile
              get().fetchProfile().catch(() => {});
              return true;
            }
          } catch {
            // Both session endpoints failed - session is invalid or expired
          }
        }

        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      },

      refreshAuthToken: async (): Promise<boolean> => {
        try {
          const session = await container.refreshTokenUseCase.execute();
          if (session?.user) {
            set((state) => ({
              user: session.user || state.user,
              isAuthenticated: true,
            }));
            return true;
          }
          return false;
        } catch {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      resendVerificationEmail: async (email?: string): Promise<string> => {
        const targetEmail =
          email || get().user?.email || get().profile?.email || "";
        const result =
          await container.resendVerificationUseCase.execute(targetEmail);
        return (
          result.message || "Verification link sent to your email address."
        );
      },

      verifyEmail: async (token: string): Promise<string> => {
        const result = await container.verifyEmailUseCase.execute(token);
        get()
          .fetchProfile()
          .catch(() => {});
        return result.message || "Email verified successfully!";
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await container.logoutUseCase.execute();
        } finally {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: "AuthStore",
      enabled: process.env.NODE_ENV !== "production",
    }
  )
);

// Expose store globally in browser console for debugging
if (typeof window !== "undefined") {
  (window as unknown as { useAuthStore: typeof useAuthStore }).useAuthStore =
    useAuthStore;
}

// Connect HttpClient hooks to Zustand state and HttpOnly cookie refresh
httpClient.setTokenProvider(() => null);
httpClient.setTokenRefresher(async () =>
  useAuthStore.getState().refreshAuthToken()
);
httpClient.setOnUnauthorized(() => {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (
      path !== "/login" &&
      path !== "/signup" &&
      path !== "/forgot-password" &&
      path !== "/reset-password" &&
      path !== "/verify-email"
    ) {
      window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
    }
  }
});
