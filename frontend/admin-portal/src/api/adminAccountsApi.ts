// src/api/adminAccountsApi.ts
import axiosClient from "./axiosClient";

export type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED";
export type AccountType = "SAVINGS" | "CURRENT" | "FIXED_DEPOSIT";

export interface AccountResponse {
  id: number;
  accountNumber: string;
  customerId: number;
  accountType: AccountType;
  status: AccountStatus;
  balance: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountSummaryResponse {
  accountNumber: string;
  balance: number | string;
  totalDeposits: number;
  totalWithdrawals: number;
  lastTransactionDate?: string;
}

export const adminAccountsApi = {
  getByAccountNumber: async (accountNumber: string): Promise<AccountResponse> => {
    const res = await axiosClient.get<AccountResponse>(`/api/accounts/${accountNumber}`);
    return res.data;
  },

  updateStatus: async (accountNumber: string, status: AccountStatus): Promise<AccountResponse> => {
    const res = await axiosClient.patch<AccountResponse>(`/api/accounts/${accountNumber}/status`, {
      status,
    });
    return res.data;
  },

  getSummary: async (accountNumber: string): Promise<AccountSummaryResponse> => {
    const res = await axiosClient.get<AccountSummaryResponse>(`/api/accounts/${accountNumber}/summary`);
    return res.data;
  },
};
