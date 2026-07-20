import axiosClient from "./axiosClient";

export type AccountType = "SAVINGS" | "CURRENT" | "FIXED_DEPOSIT";
export type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED";

// BigDecimal may arrive as number or string. We normalize.
export interface Account {
  id: number;
  accountNumber: string;
  customerId: number;
  accountType: AccountType;
  status: AccountStatus;
  balance: number; // normalized
  createdAt: string;
  updatedAt: string;

  // Your Accounts.tsx shows IFSC. If backend sends it, keep it optional.
  // If backend does NOT send it, keep optional to avoid TS error.
  ifsc?: string;
}

export interface AccountCreateRequest {
  customerId: number;
  accountType: AccountType;
  initialDeposit: number; // maps to BigDecimal
}

/** Adjust fields to match your backend /api/accounts/{accountNumber}/summary response */
export interface AccountSummary {
  accountNumber: string;
  balance: number | string;
  totalDeposits: number | string;
  totalWithdrawals: number | string;
  lastTransactionDate?: string | null;
}

type RawAccount = Omit<Account, "balance"> & { balance: number | string };

const toNumber = (v: number | string | null | undefined) => {
  if (v === null || v === undefined) return 0;
  return typeof v === "string" ? Number(v) : v;
};

export const accountsApi = {
  getAccountsByCustomer: async (customerId: string | number): Promise<Account[]> => {
    const res = await axiosClient.get<RawAccount[]>(`/api/accounts/customer/${customerId}`);
    return (res.data ?? []).map((a) => ({ ...a, balance: toNumber(a.balance) }));
  },

  createAccount: async (payload: AccountCreateRequest): Promise<Account> => {
    const res = await axiosClient.post<RawAccount>("/api/accounts", payload);
    const a = res.data;
    return { ...a, balance: toNumber(a.balance) };
  },

  /** Standard name used by AccountSummaryPage */
  getAccountSummary: async (accountNumber: string): Promise<AccountSummary> => {
    const res = await axiosClient.get<AccountSummary>(`/api/accounts/${accountNumber}/summary`);
    return res.data;
  },
};
