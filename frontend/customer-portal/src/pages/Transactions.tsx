import React, { useEffect, useState } from "react";
import { transactionsApi } from "../api/transactionApi";
import type { Transaction } from "../api/transactionApi";
import { accountsApi } from "../api/accountApi";
import { useAuth } from "../context/AuthContext";

const toNumber = (v: number | string | null | undefined) => {
  if (v === null || v === undefined) return 0;
  return typeof v === "string" ? Number(v) : v;
};

const formatAccountRef = (tx: Transaction) => {
  if (tx.type === "DEPOSIT") return `Deposit → ${tx.toAccount ?? "-"}`;
  if (tx.type === "WITHDRAW") return `Withdraw ← ${tx.fromAccount ?? "-"}`;
  return `${tx.fromAccount ?? "-"} → ${tx.toAccount ?? "-"}`;
};

const Transactions: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvePrimaryAccount = async (): Promise<string | null> => {
    const stored = localStorage.getItem("primaryAccount");
    if (stored) return stored;

    if (!user?.id) return null;

    const accs = await accountsApi.getAccountsByCustomer(user.id);
    const active = accs.find((a) => a.status === "ACTIVE");
    if (!active) return null;

    localStorage.setItem("primaryAccount", active.accountNumber);
    return active.accountNumber;
  };

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const primary = await resolvePrimaryAccount();
      if (!primary) {
        setTransactions([]);
        setError("No active account found. Please create an account first.");
        return;
      }

      const data = await transactionsApi.getTransactionsByAccount(primary);
      setTransactions(data ?? []);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      setError(msg ?? "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading transactions...</div>;

  return (
    <section className="card">
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div className="card-title">Transaction History</div>
          <div className="card-subtitle">Live data from Transaction-Service via API Gateway</div>
        </div>
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      {error && <div style={{ padding: 12, fontSize: 13 }} className="alert">{error}</div>}

      {transactions.length === 0 ? (
        <div style={{ padding: 12, fontSize: 13 }}>No transactions found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Transaction Id</th>
              <th>Reference</th>
              <th>Type</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.transactionId}>
                <td>{new Date(tx.timestamp).toLocaleString()}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{tx.transactionId}</td>
                <td>{formatAccountRef(tx)}</td>
                <td>
                  <span className={tx.type === "DEPOSIT" ? "badge-positive" : tx.type === "WITHDRAW" ? "badge-negative" : ""}>
                    {tx.type}
                  </span>
                </td>
                <td>{tx.status}</td>
                <td>₹ {toNumber(tx.amount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default Transactions;
