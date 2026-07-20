// src/api/axiosClient.ts
import axios from "axios";

type StoredAdminAuth =
  | { accessToken?: string; token?: string; tokenType?: string }
  | { token?: string }
  | string;

function normalizeBearerToken(input?: string): string | null {
  if (!input) return null;
  return input.startsWith("Bearer ") ? input : `Bearer ${input}`;
}

function readAdminToken(): string | null {
  const stored = localStorage.getItem("admin-auth");
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as StoredAdminAuth;

    // Case 1: { accessToken, tokenType }
    if (typeof parsed === "object" && parsed !== null) {
      const accessToken = (parsed as any).accessToken as string | undefined;
      const token = (parsed as any).token as string | undefined;

      // token might already include "Bearer ..."
      if (token) return normalizeBearerToken(token.replace(/^Bearer\s+/i, "").trim()) ?? token;

      if (accessToken) return normalizeBearerToken(accessToken);
    }

    // Case 2: stored raw string
    if (typeof parsed === "string") return normalizeBearerToken(parsed);
  } catch {
    // Case 3: if it’s not JSON, treat as raw string
    return normalizeBearerToken(stored);
  }

  return null;
}

const axiosClient = axios.create({
  baseURL: "http://13.234.48.49:8080", // API Gateway
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const url = config.url ?? "";

  // Do not send Authorization for auth endpoints
  if (url.startsWith("/api/auth/") || url.includes("/api/auth/login") || url.includes("/api/auth/register")) {
    return config;
  }

  const token = readAdminToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token;
  }

  return config;
});

export default axiosClient;
