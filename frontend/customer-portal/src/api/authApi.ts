import axiosClient from "./axiosClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string; // "Bearer"
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosClient.post("/api/auth/login", payload);
    return res.data as AuthResponse;
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const res = await axiosClient.post("/api/auth/register", payload);
    return res.data as AuthResponse;
  },
};
