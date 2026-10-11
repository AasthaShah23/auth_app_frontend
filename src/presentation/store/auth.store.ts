import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  User,
  AuthSession,
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
  signup: (credentials: SignupCredentials) => Promise<AuthSession>;
  checkAuth: () => Promise<boolean>;
  refreshAuthToken: () => Promise<boolean>;
  fetchProfile: (force?: boolean) => Promise<ProfileDTO | null>;
  resendVerificationEmail: (email?: string) => Promise<string>;
  verifyEmail: (token: string) => Promise<string>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfile: (profile: ProfileDTO | null) => void;
}

// In-flight promise caching to eliminate redundant concurrent calls to /me
let activeCheckAuthPromise: Promise<boolean> | null = null;
let activeFetchProfilePromise: Promise<ProfileDTO | null> | null = null;

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

          // Fetch profile details once on login
          get()
            .fetchProfile(true)
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

          // Fetch profile details once on signup
          get()
            .fetchProfile(true)
            .catch(() => {});
          return session;
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

      fetchProfile: async (force = false): Promise<ProfileDTO | null> => {
        // Return existing profile if already cached and not forced
        if (!force && get().profile) {
          return get().profile;
        }

        // Return in-flight request if already loading
        if (activeFetchProfilePromise) {
          return activeFetchProfilePromise;
        }

        activeFetchProfilePromise = (async () => {
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
            // If backend returns 403 (unverified email), ensure profile reflects is_email_verified = false
            set((state) => ({
              profile: {
                id: Number(state.user?.id) || 0,
                name: state.user?.name || "User",
                email: state.user?.email || "",
                is_email_verified: false,
                is_active: true,
                created_at: state.profile?.created_at || "",
              },
            }));
            return null;
          } finally {
            activeFetchProfilePromise = null;
          }
        })();

        return activeFetchProfilePromise;
      },

      checkAuth: async (): Promise<boolean> => {
        // If already authenticated and profile loaded, no need to call /me again
        if (get().isAuthenticated && get().user && get().profile) {
          return true;
        }

        // Return in-flight request if already checking session
        if (activeCheckAuthPromise) {
          return activeCheckAuthPromise;
        }

        activeCheckAuthPromise = (async () => {
          set({ isLoading: true });
          try {
            // 1. Primary session endpoint: GET /api/profile/me using HttpOnly cookie (ONCE on refresh)
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
                return true;
              }
            } catch {
              // Both session endpoints failed - session is invalid or expired
            }
          } finally {
            activeCheckAuthPromise = null;
          }

          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        })();

        return activeCheckAuthPromise;
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
        if (!targetEmail) {
          throw new Error("Please enter your email address to resend the verification link.");
        }
        const result =
          await container.resendVerificationUseCase.execute(targetEmail);
        return (
          result.message || "Verification link sent to your email address."
        );
      },

      verifyEmail: async (token: string): Promise<string> => {
        const result = await container.verifyEmailUseCase.execute(token);
        get()
          .fetchProfile(true)
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
