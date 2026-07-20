import axiosClient from "./axiosClient";

export type TransactionType = "DEPOSIT" | "WITHDRAW" | "TRANSFER";

export interface Transaction {
  transactionId: string;
  fromAccount: string | null;
  toAccount: string | null;
  amount: number | string;     // BigDecimal safe
  type: TransactionType;
  timestamp: string;           // Instant -> ISO string
  status: string;
}

export interface TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;              // backend expects BigDecimal, number is fine
}

export const transactionsApi = {
  getTransactionsByAccount: async (accountNumber: string): Promise<Transaction[]> => {
    const res = await axiosClient.get(`/api/transactions/${accountNumber}`);
    return res.data as Transaction[];
  },

  transfer: async (payload: TransferRequest): Promise<any> => {
    const res = await axiosClient.post(`/api/transactions/transfer`, payload);
    return res.data;
  },
};
