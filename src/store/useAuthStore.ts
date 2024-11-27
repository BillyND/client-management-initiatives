import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../services";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  setAuth: (user?: User, tokens?: { access: string; refresh: string }) => void;
  logout: () => void;
}

// Define cookie options
const COOKIE_OPTIONS = {
  secure: true,
  sameSite: "strict" as const,
  expires: 7, // 7 days
};

const cookieStorage = {
  getItem: (name: string) => {
    const value = Cookies.get(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    Cookies.set(name, JSON.stringify(value), COOKIE_OPTIONS);
  },
  removeItem: (name: string) => {
    Cookies.remove(name, COOKIE_OPTIONS);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      refreshToken: "",
      isAuthenticated: false,
      setAuth: (user, tokens) =>
        set({
          ...(user ? { user } : {}),
          ...(tokens?.access ? { accessToken: tokens.access } : {}),
          ...(tokens?.refresh ? { refreshToken: tokens.refresh } : {}),
          ...(user ? { isAuthenticated: true } : {}),
        }),
      logout: () => {
        set({
          user: null,
          accessToken: "",
          refreshToken: "",
          isAuthenticated: false,
        });

        // Redirect to auth page
        window.location.href = "/auth";
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
      // Only save necessary information
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
