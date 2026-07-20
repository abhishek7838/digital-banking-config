import axiosClient from "./axiosClient";

export const adminDashboardApi = {
  
  // 1. Fetch Total Users
  getTotalUsers: async (): Promise<number> => {
    try {
      // This calls your existing AdminMetricsController in user-service
      const res = await axiosClient.get("/api/users/admin/count");
      return res.data?.total || res.data?.count || res.data || 0;
    } catch (error) {
      console.error("Failed to fetch total users", error);
      return 0;
    }
  },

  // 2. Fetch Total Accounts
  getTotalAccounts: async (): Promise<number> => {
    try {
      // This calls the new AdminAccountController we just made in Java
      const res = await axiosClient.get("/api/accounts/admin/count");
      return res.data || 0;
    } catch (error) {
      console.error("Failed to fetch total accounts", error);
      return 0;
    }
  }
};