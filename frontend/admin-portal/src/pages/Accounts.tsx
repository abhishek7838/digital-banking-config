// src/pages/Accounts.tsx
import { useMemo, useState } from "react";
import { adminAccountsApi } from "../api/adminAccountsApi";
import type { AccountResponse, AccountStatus, AccountSummaryResponse } from "../api/adminAccountsApi";

const pillClass = (status: AccountStatus) => {
  if (status === "ACTIVE") return "bg-green-500/10 text-green-300 border-green-500/30";
  if (status === "FROZEN") return "bg-amber-500/10 text-amber-300 border-amber-500/30";
  return "bg-red-500/10 text-red-300 border-red-500/30";
};

const safeMoney = (val: number | string | undefined | null) => {
  const n = Number(val);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
};

const Accounts: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<null | AccountStatus>(null);
  const [error, setError] = useState<string | null>(null);

  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [summary, setSummary] = useState<AccountSummaryResponse | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const canSearch = useMemo(() => accountNumber.trim().length >= 6 && !loading, [accountNumber, loading]);

  const loadAccount = async () => {
    setError(null);
    setSummaryError(null);
    setLoading(true);
    setAccount(null);
    setSummary(null);

    const value = accountNumber.trim();

    try {
      const acc = await adminAccountsApi.getByAccountNumber(value);
      setAccount(acc);

      try {
        const s = await adminAccountsApi.getSummary(value);
        setSummary(s);
      } catch (e: any) {
        setSummaryError(e?.response?.data?.message ?? "Summary not available.");
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to fetch account. Check account number.");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (status: AccountStatus) => {
    if (!account) return;
    setError(null);
    setUpdating(status);

    try {
      const updated = await adminAccountsApi.updateStatus(account.accountNumber, status);
      setAccount(updated);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? `Failed to update status to ${status}.`);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="text-slate-100">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Accounts</h1>
        <p className="text-xs text-slate-400 mt-1">
          Search account and manage status (ACTIVE / FROZEN / CLOSED).
        </p>
      </div>

      <div className="banking-card border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="text-xs text-slate-400">Account Number</label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSearch) loadAccount();
              }}
              placeholder="Enter account number"
              className="banking-input mt-1"
            />
          </div>

          <button
            onClick={loadAccount}
            disabled={!canSearch}
            className={`banking-button-primary md:w-44 ${!canSearch ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-xs rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {account && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="banking-card border border-slate-800 bg-slate-950/70 p-4 lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">Account</div>
                <div className="text-lg font-semibold">{account.accountNumber}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Customer ID: <span className="text-slate-200">{account.customerId}</span> • Type:{" "}
                  <span className="text-slate-200">{account.accountType}</span>
                </div>
              </div>

              <div className={`text-xs px-3 py-1 rounded-full border ${pillClass(account.status)}`}>
                {account.status}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
                <div className="text-[11px] text-slate-400">Balance</div>
                <div className="text-lg font-semibold mt-1">₹ {safeMoney(account.balance)}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
                <div className="text-[11px] text-slate-400">Created</div>
                <div className="text-sm mt-1 text-slate-200">
                  {account.createdAt ? new Date(account.createdAt).toLocaleString() : "—"}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
                <div className="text-[11px] text-slate-400">Updated</div>
                <div className="text-sm mt-1 text-slate-200">
                  {account.updatedAt ? new Date(account.updatedAt).toLocaleString() : "—"}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => changeStatus("ACTIVE")}
                disabled={updating !== null || account.status === "CLOSED"}
                className={`banking-button-ghost ${updating === "ACTIVE" ? "opacity-70" : ""}`}
              >
                {updating === "ACTIVE" ? "Updating..." : "Set ACTIVE"}
              </button>

              <button
                onClick={() => changeStatus("FROZEN")}
                disabled={updating !== null || account.status === "CLOSED"}
                className={`banking-button-ghost ${updating === "FROZEN" ? "opacity-70" : ""}`}
              >
                {updating === "FROZEN" ? "Updating..." : "Freeze"}
              </button>

              <button
                onClick={() => changeStatus("CLOSED")}
                disabled={updating !== null}
                className={`banking-button-ghost border-red-500/40 text-red-200 hover:bg-red-500/10 ${
                  updating === "CLOSED" ? "opacity-70" : ""
                }`}
              >
                {updating === "CLOSED" ? "Updating..." : "Close Account"}
              </button>
            </div>
          </div>

          <div className="banking-card border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-sm font-semibold">Account Summary</div>

            {summaryError && (
              <div className="mt-3 text-xs rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-200 px-3 py-2">
                {summaryError}
              </div>
            )}

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Balance</span>
                <span className="text-slate-100">₹ {safeMoney(summary?.balance ?? account.balance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Deposits</span>
                <span className="text-slate-100">{summary?.totalDeposits ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Withdrawals</span>
                <span className="text-slate-100">{summary?.totalWithdrawals ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Txn</span>
                <span className="text-slate-100">
                  {summary?.lastTransactionDate ? new Date(summary.lastTransactionDate).toLocaleString() : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
