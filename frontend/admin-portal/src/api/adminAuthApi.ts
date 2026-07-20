import axiosClient from "./axiosClient";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

// matches backend AuthResponse { accessToken, tokenType }
export interface AdminLoginResponse {
  accessToken: string;
  tokenType: string; // "Bearer"
}

export const adminAuthApi = {
  login: async (payload: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const res = await axiosClient.post("/api/auth/login", payload);
    return res.data;
  },
};
