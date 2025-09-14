import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthTokens, clearAuthTokens, refreshAccessToken } from "@/api/http";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_2fa_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthSlice {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  setSession: (p: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string | null;
    expiresInSec?: number;
  }) => void;
  login: (email: string, password: string) => Promise<boolean>;
  reset: () => void;
  ensureFreshAccess: () => Promise<string | null>;
}

interface AuthStore { auth: AuthSlice }

const ACCESS_SAFETY_WINDOW_MS = 30_000; // refresh 30s before expiry

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      auth: {
        user: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        isAuthenticated: () => !!get().auth.accessToken && !!get().auth.user,
        hasRole: (role: string) => get().auth.user?.role === role,
        hasAnyRole: (roles: string[]) => {
          const u = get().auth.user;
          return !!u && roles.includes(u.role);
        },
        setSession: ({ user, accessToken, refreshToken, expiresInSec }) => {
          const expiresAt =
            Date.now() + (expiresInSec ? expiresInSec * 1000 : 15 * 60 * 1000);
          set({
            auth: { ...get().auth, user, accessToken, refreshToken, expiresAt },
          });
          setAuthTokens(accessToken);
        },

        // Login using demo credentials
        login: async (email: string, password: string) => {
          // Demo users setup
          const demoUsers = {
            admin: {
              email: "admin@example.com",
              password: "admin123",
              role: "admin",
              full_name: "Admin User"
            },
            collector: {
              email: "dc@jk.com",
              password: "dc@123",
              role: "collector",
              full_name: "District Collector"
            },
            municipal_officer: {
              email: "municipleofficer@example.com",
              password: "mc@123",
              role: "municipal_officer",
              full_name: "Municipal Officer"
            }
          };

          // Find matching demo user
          const matchedUser = Object.values(demoUsers).find(
            user => user.email === email && user.password === password
          );

          if (matchedUser) {
            const user: AuthUser = {
              id: matchedUser.role + "_demo",
              email: matchedUser.email,
              full_name: matchedUser.full_name,
              role: matchedUser.role,
              is_2fa_enabled: false,
            };
            
            const accessToken = matchedUser.role + "_token";
            set({
              auth: {
                ...get().auth,
                user,
                accessToken,
                refreshToken: null,
                expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365, // long lived for demo
              },
            });
            setAuthTokens(accessToken);
            return true;
          }

          return false;
        },

        reset: () => {
          clearAuthTokens();
          set({
            auth: {
              user: null,
              accessToken: null,
              refreshToken: null,
              expiresAt: null,
              isAuthenticated: get().auth.isAuthenticated,
              hasRole: get().auth.hasRole,
              hasAnyRole: get().auth.hasAnyRole,
              setSession: get().auth.setSession,
              login: get().auth.login,
              reset: get().auth.reset,
              ensureFreshAccess: get().auth.ensureFreshAccess,
            },
          });
        },

        ensureFreshAccess: async () => {
          const st = get().auth;
          if (!st.accessToken) return null;
          if (
            !st.expiresAt ||
            st.expiresAt - Date.now() > ACCESS_SAFETY_WINDOW_MS
          )
            return st.accessToken;
          try {
            const newTok = await refreshAccessToken();
            if (newTok) return newTok;
          } catch {
            /* ignore */
          }
          return null;
        },
      },
    }),
    {
      name: "auth-store",
      // Only persist serializable data, not the methods
      partialize: (state: AuthStore) => ({
        auth: {
          user: state.auth.user,
          accessToken: state.auth.accessToken,
          refreshToken: state.auth.refreshToken,
          expiresAt: state.auth.expiresAt,
        },
      }),
      merge: (persisted: any, current: any) => {
        // Reconstruct slice keeping existing methods
        if (!persisted) return current;
        const data = persisted.auth || {};
        return {
          auth: {
            ...current.auth,
            ...data,
          },
        } as AuthStore;
      },
      onRehydrateStorage: () => (state) => {
        if (state?.auth.accessToken) setAuthTokens(state.auth.accessToken);
      },
    }
  )
);

export const useAuth = () => useAuthStore((state) => state.auth);
