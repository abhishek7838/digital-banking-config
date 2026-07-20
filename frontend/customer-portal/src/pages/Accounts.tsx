import React, { useEffect, useState } from "react";
import { accountsApi } from "../api/accountApi";
import type { Account } from "../api/accountApi";
import { useAuth } from "../context/AuthContext";

const Accounts: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      // wait for auth bootstrap to finish
      if (authLoading) return;

      setLoading(true);
      setError(null);

      try {
        // ✅ Your AuthUser has "id" (customerId)
        const customerId = user?.id;
        if (!customerId) {
          setAccounts([]);
          setError("User not loaded. Please login again.");
          return;
        }

        const data = await accountsApi.getAccountsByCustomer(customerId);
        setAccounts(data ?? []);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          (typeof e?.response?.data === "string" ? e.response.data : null);
        setError(msg ?? "Failed to load accounts.");
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id, authLoading]);

  if (loading) return <div style={{ padding: 20 }}>Loading accounts...</div>;

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Accounts</div>
          <div className="card-subtitle">Linked accounts under your Customer ID</div>
        </div>
      </div>

      {error && <div style={{ padding: 12, fontSize: 13 }} className="alert">{error}</div>}

      {accounts.length === 0 ? (
        <div style={{ padding: 12, fontSize: 13 }}>No accounts found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Type</th>
              <th>Status</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.accountNumber}>
                <td>{a.accountNumber}</td>
                <td>{a.accountType}</td>
                <td>{a.status}</td>
                <td>₹ {Number(a.balance).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default Accounts;
