import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transactionsApi } from "../api/transactionApi";
import { accountsApi } from "../api/accountApi";
import type { Account } from "../api/accountApi";
import { useAuth } from "../context/AuthContext";

const Transfer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccount, setFromAccount] = useState<string>(localStorage.getItem("primaryAccount") ?? "");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedFrom = useMemo(
    () => accounts.find((a) => a.accountNumber === fromAccount) ?? null,
    [accounts, fromAccount]
  );

  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.id) return;
        const data = await accountsApi.getAccountsByCustomer(user.id);
        const active = (data ?? []).filter((a) => a.status === "ACTIVE");

        setAccounts(active);

        // auto-select if not set
        if (!fromAccount && active.length > 0) {
          setFromAccount(active[0].accountNumber);
          localStorage.setItem("primaryAccount", active[0].accountNumber);
        }
      } catch {
        // ignore; show in UI later if needed
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const to = toAccount.trim();
    const amt = Number(amount);

    if (!fromAccount) {
      setMessage("From account not selected. Please open Dashboard once.");
      return;
    }
    if (!to) {
      setMessage("To Account is required.");
      return;
    }
    if (to === fromAccount) {
      setMessage("From and To account cannot be the same.");
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      setMessage("Amount must be a valid positive number.");
      return;
    }

    // frontend guard for insufficient balance (still keep backend validation)
    if (selectedFrom && amt > Number(selectedFrom.balance)) {
      setMessage(`Insufficient balance. Available: ₹ ${Number(selectedFrom.balance).toLocaleString()}`);
      return;
    }

    if (loading) return;
    setLoading(true);
    setMessage(null);

    try {
      await transactionsApi.transfer({
        fromAccount,
        toAccount: to,
        amount: amt,
      });

      navigate("/transactions");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Fund Transfer</h2>

        {message && <div className="alert">{message}</div>}

        <label>From Account</label>
        <select
          value={fromAccount}
          onChange={(e) => {
            setFromAccount(e.target.value);
            localStorage.setItem("primaryAccount", e.target.value);
          }}
          required
        >
          <option value="" disabled>Select account</option>
          {accounts.map((a) => (
            <option key={a.accountNumber} value={a.accountNumber}>
              {a.accountNumber} ({a.accountType}) - ₹ {Number(a.balance).toLocaleString()}
            </option>
          ))}
        </select>

        <label>To Account</label>
        <input
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          placeholder="Enter beneficiary account number"
          required
        />

        <label>Amount</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Transfer"}
        </button>
      </form>
    </div>
  );
};

export default Transfer;
