// ============================================================
// AuthContext: the app's single source of truth for "who is
// logged in and what is their role". Persists the JWT in
// localStorage and restores the session on refresh via /auth/me.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getToken, setToken, clearToken } from "../lib/api";
import {
  loginRequest,
  registerRequest,
  fetchMe,
} from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `loading` is true only while we restore a session on first load,
  // so route guards can wait instead of bouncing to /login on refresh.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    // We have a token from a previous session: verify it and load the user.
    fetchMe()
      .then((me) => setUser(me))
      .catch(() => {
        // Token expired / invalid -> drop it.
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user; // caller uses user.role to redirect
  }, []);

  const register = useCallback(async (form) => {
    const data = await registerRequest(form);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  // Merge partial updates into the current user (e.g. after editing profile),
  // so the navbar and other screens reflect the change immediately.
  const updateUser = useCallback((partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}