// ✅ src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

export interface AdminUser {
  email: string;
  token: string; // "Bearer <accessToken>"
  fullName?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  initializing: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "admin-auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ read localStorage synchronously to avoid refresh redirect issue
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as AdminUser;
      return parsed?.token ? parsed : null;
    } catch {
      return null;
    }
  });

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // set axios default header if admin already exists
    if (admin?.token) {
      axiosClient.defaults.headers.common["Authorization"] = admin.token;
    } else {
      delete axiosClient.defaults.headers.common["Authorization"];
    }
    setInitializing(false);
  }, [admin]);

  const login = (user: AdminUser) => {
    setAdmin(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    axiosClient.defaults.headers.common["Authorization"] = user.token;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
    delete axiosClient.defaults.headers.common["Authorization"];
  };

  const value = useMemo(() => ({ admin, initializing, login, logout }), [admin, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
