import axiosClient from "./axiosClient";

export interface UserProfileResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export const userApi = {
  me: async (): Promise<UserProfileResponse> => {
    const res = await axiosClient.get("/api/users/me");
    return res.data as UserProfileResponse;
  },
};
