import axiosClient from "./axiosClient";

export interface SuspiciousTxn {
  transactionId?: string;
  id?: number;

  fromAccount?: string | null;
  toAccount?: string | null;

  amount: number;
  type?: string;
  status?: string;

  timestamp?: string;
  createdAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index
  size: number;
}

export const adminTransactionsApi = {
  getSuspicious: async (params: {
    minAmount: number;
    page: number;
    size: number;
  }): Promise<PageResponse<SuspiciousTxn>> => {
    const res = await axiosClient.get("/api/transactions/admin/suspicious", {
      params,
    });
    return res.data as PageResponse<SuspiciousTxn>;
  },

  getSuspiciousCount: async (minAmount: number): Promise<number> => {
    const res = await axiosClient.get(
      "/api/transactions/admin/suspicious/count",
      {
        params: { minAmount },
      }
    );
    return Number(res.data?.suspiciousCount ?? 0);
  },
};
