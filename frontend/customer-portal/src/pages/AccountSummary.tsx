import React, { useEffect, useState } from "react";
import { accountsApi } from "../api/accountApi";
import type { AccountSummary } from "../api/accountApi";

const AccountSummaryPage: React.FC = () => {
  const accountNumber = localStorage.getItem("primaryAccount");

  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!accountNumber) {
          setSummary(null);
          setError("Primary account not selected yet. Please open Dashboard once.");
          return;
        }

        // ✅ Your accountApi.ts currently exposes getSummary(accountNumber)
        const data = await accountsApi.getSummary(accountNumber);
        setSummary(data ?? null);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          (typeof e?.response?.data === "string" ? e.response.data : null);
        setError(msg ?? "Failed to load account summary.");
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [accountNumber]);

  if (loading) return <div style={{ padding: 20 }}>Loading account summary...</div>;

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <div className="alert">{error}</div>
      </div>
    );
  }

  if (!summary) {
    return <div style={{ padding: 20 }}>No account summary available.</div>;
  }

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Account Summary</div>
          <div className="card-subtitle">Account Number: {summary.accountNumber}</div>
        </div>
      </div>

      <div className="metric-row">
        <div className="metric-pill">
          <span className="metric-label">Current Balance</span>
          <span className="metric-value">₹ {Number(summary.balance).toLocaleString()}</span>
        </div>

        <div className="metric-pill">
          <span className="metric-label">Total Deposits</span>
          <span className="metric-value">₹ {Number(summary.totalDeposits).toLocaleString()}</span>
        </div>

        <div className="metric-pill">
          <span className="metric-label">Total Withdrawals</span>
          <span className="metric-value">₹ {Number(summary.totalWithdrawals).toLocaleString()}</span>
        </div>

        <div className="metric-pill">
          <span className="metric-label">Last Transaction</span>
          <span className="metric-value">
            {summary.lastTransactionDate ? new Date(summary.lastTransactionDate).toLocaleString() : "—"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default AccountSummaryPage;
