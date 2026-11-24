import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loginRequest,
  logoutRequest,
  meRequest,
  registerRequest,
  type RegisterPayload,
} from "@/api/auth";
import { ApiError } from "@/api/client";
import { clearStoredToken, setStoredToken } from "@/api/session";
import type { SafeUser } from "@/types";

type AuthResult = { success: boolean; error?: string };

type AuthContextType = {
  user: SafeUser | null;
  loading: boolean;
  setUser: (user: SafeUser | null) => void;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await meRequest();
      if (data.success && data.user) {
        setUser(data.user);
        return;
      }
      setUser(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await clearStoredToken();
      }
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const data = await loginRequest(email, password);
        if (!data.success || !data.user) {
          return { success: false, error: data.error ?? "Giriş başarısız" };
        }

        if (data.token) {
          await setStoredToken(data.token);
        }

        setUser(data.user);
        return { success: true };
      } catch (error) {
        if (error instanceof ApiError) {
          return { success: false, error: error.message };
        }
        return { success: false, error: "Sunucuya bağlanılamadı" };
      }
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<AuthResult> => {
      try {
        const data = await registerRequest(payload);
        if (!data.success || !data.user) {
          return { success: false, error: data.error ?? "Kayıt başarısız" };
        }

        if (data.token) {
          await setStoredToken(data.token);
        }

        setUser(data.user);
        return { success: true };
      } catch (error) {
        if (error instanceof ApiError) {
          return { success: false, error: error.message };
        }
        return { success: false, error: "Sunucuya bağlanılamadı" };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      await clearStoredToken();
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
