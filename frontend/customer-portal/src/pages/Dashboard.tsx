import React, { useEffect, useState } from "react";
import { accountsApi } from "../api/accountApi";
import type { Account } from "../api/accountApi";
import { transactionsApi } from "../api/transactionApi";
import type { Transaction } from "../api/transactionApi";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/userApi";
import type { UserProfileResponse } from "../api/userApi";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Keep this if you want fresh KYC from backend:
        const me = await userApi.me();
        setProfile(me);

        // Load accounts
        const accs = await accountsApi.getAccountsByCustomer(me.id);
        setAccounts(accs);

        // Pick first ACTIVE as primary
        const active = accs.filter((a) => a.status === "ACTIVE");
        const primary = active[0] ?? null;

        if (primary) {
          localStorage.setItem("primaryAccount", primary.accountNumber);

          const txns = await transactionsApi.getTransactionsByAccount(primary.accountNumber);
          setTransactions((txns ?? []).slice(0, 5));
        } else {
          localStorage.removeItem("primaryAccount");
          setTransactions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user?.id]);

  if (loading) return <div style={{ padding: 20 }}>Loading dashboard...</div>;

  const activeAccounts = accounts.filter((a) => a.status === "ACTIVE");
  const totalBalance = activeAccounts.reduce((sum, acc) => sum + (acc.balance ?? 0), 0);
  const primaryAccount = activeAccounts[0]?.accountNumber ?? "-";

  return (
    <div className="content-grid">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              Welcome, {profile?.firstName} {profile?.lastName}
            </div>
            <div className="card-subtitle">{profile?.email}</div>
          </div>

          <div
            className={
              profile?.kycStatus === "APPROVED"
                ? "badge-positive"
                : profile?.kycStatus === "REJECTED"
                ? "badge-negative"
                : "badge-warning"
            }
          >
            KYC: {profile?.kycStatus}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Account Snapshot</div>
            <div className="card-subtitle">Linked accounts overview</div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-pill">
            <span className="metric-label">Total Balance</span>
            <span className="metric-value">₹ {totalBalance.toLocaleString()}</span>
            <span className="metric-trend">{activeAccounts.length} Active Accounts</span>
          </div>

          <div className="metric-pill">
            <span className="metric-label">Primary Account</span>
            <span className="metric-value">{primaryAccount}</span>
            <span className="metric-trend">Auto-selected</span>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Quick Actions</div>
            <div className="card-subtitle">Common banking operations</div>
          </div>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}>
          <li style={{ padding: "6px 0" }}>· <a href="/accounts/new">Create new account</a></li>
          <li style={{ padding: "6px 0" }}>· <a href="/transfer">Transfer funds</a></li>
          <li style={{ padding: "6px 0" }}>· <a href="/accounts/summary">View account summary</a></li>
          <li style={{ padding: "6px 0" }}>· Update KYC details</li>
        </ul>
      </section>

      <section className="card" style={{ gridColumn: "1 / span 2" }}>
        <div className="card-header">
          <div>
            <div className="card-title">Recent Transactions</div>
            <div className="card-subtitle">Latest activity on primary account</div>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: 12, fontSize: 13 }}>No recent transactions found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>From → To</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transactionId}>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>{tx.fromAccount ?? "-"} → {tx.toAccount ?? "-"}</td>
                  <td>
                    <span className={tx.type === "DEPOSIT" ? "badge-positive" : tx.type === "WITHDRAW" ? "badge-negative" : ""}>
                      {tx.type}
                    </span>
                  </td>
                  <td>₹ {Number(tx.amount).toLocaleString()}</td>
                  <td>{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
