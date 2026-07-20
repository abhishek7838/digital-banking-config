import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import type { LoginRequest, AuthResponse } from "../api/authApi";
import { userApi } from "../api/userApi";
import type { UserProfileResponse } from "../api/userApi";

interface AuthUser {
  id: number;           // <-- this is customerId for accounts-service
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as AuthUser);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (payload: LoginRequest) => {
    const res: AuthResponse = await authApi.login(payload);

    // store token first so axios interceptor sends it to /me
    setToken(res.accessToken);
    localStorage.setItem("authToken", res.accessToken);

    const me: UserProfileResponse = await userApi.me();

    const authUser: AuthUser = {
      id: me.id,
      email: me.email,
      firstName: me.firstName,
      lastName: me.lastName,
    };

    setUser(authUser);
    localStorage.setItem("authUser", JSON.stringify(authUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("primaryAccount");
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
