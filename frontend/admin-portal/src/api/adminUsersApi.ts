// src/api/adminUsersApi.ts
import axiosClient from "./axiosClient";

export type UserProfileResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export const adminUsersApi = {
  getByEmail: async (email: string): Promise<UserProfileResponse> => {
    const res = await axiosClient.get("/api/users/by-email", { params: { email } });
    return res.data as UserProfileResponse;
  },

  getMe: async (): Promise<UserProfileResponse> => {
    const res = await axiosClient.get("/api/users/me");
    return res.data as UserProfileResponse;
  },
};
