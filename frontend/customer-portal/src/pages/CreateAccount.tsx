import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { accountsApi } from "../api/accountApi";
import { useAuth } from "../context/AuthContext";

type AccountType = "SAVINGS" | "CURRENT";

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [accountType, setAccountType] = useState<AccountType>("SAVINGS");
  const [initialDeposit, setInitialDeposit] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!user?.id) {
      setMessage("User session not found. Please login again.");
      return;
    }

    const deposit = Number(initialDeposit);
    if (Number.isNaN(deposit) || deposit < 0) {
      setMessage("Initial deposit must be a valid number (>= 0).");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await accountsApi.createAccount({
        customerId: user.id,
        accountType,
        initialDeposit: deposit,
      });

      // Force dashboard to re-auto-pick primary account after account creation
      localStorage.removeItem("primaryAccount");

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Create New Account</h2>

        {message && <div className="alert">{message}</div>}

        <label>Account Type</label>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value as AccountType)}
        >
          <option value="SAVINGS">Savings Account</option>
          <option value="CURRENT">Current Account</option>
        </select>

        <label>Initial Deposit</label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={initialDeposit}
          onChange={(e) => setInitialDeposit(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
