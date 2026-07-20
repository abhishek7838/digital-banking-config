import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuthApi } from "../api/adminAuthApi";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await adminAuthApi.login({ email, password });

      const tokenType = res.tokenType ?? "Bearer";
      const token = `${tokenType} ${res.accessToken}`;

      login({
        email,
        token,
        fullName: "Administrator", // backend doesn’t return name; keep fixed for UI
      });

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ??
          "Invalid credentials or server error. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Left info panel */}
      <section className="hidden lg:flex flex-col justify-between w-[45%] px-12 py-10 text-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Digital Banking
            <span className="h-1 w-1 rounded-full bg-banking-accent" />
            Admin Portal
          </div>

          <h1 className="mt-6 text-3xl font-semibold leading-tight">
            Secure Operations
            <br />
            For <span className="text-banking-accent">Bank Administrators</span>
          </h1>

          <p className="mt-4 text-sm text-slate-400 max-w-md">
            Monitor users, approve KYC, freeze accounts, and review suspicious
            transactions from a single, secure console.
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-500">
          <div className="flex gap-4">
            <span className="badge-success">24x7 Monitoring</span>
            <span className="badge-warning">PCI-DSS Ready</span>
          </div>
          <p>Access restricted to authorized bank staff only.</p>
        </div>
      </section>

      {/* Right login card */}
      <section className="w-full lg:w-[55%] flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-md w-full">
          <div className="banking-card shadow-banking bg-slate-950/90 border border-slate-800/80">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">
                Admin Login
              </div>
              <h2 className="text-xl font-semibold text-slate-50">
                Sign in to Admin Console
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Use your admin credentials issued by the bank’s IT team.
              </p>
            </div>

            {error && (
              <div className="mb-4 text-xs rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="banking-input"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bank.com"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="banking-input"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`banking-button-primary w-full mt-2 ${
                  submitting ? "opacity-70 cursor-wait" : ""
                }`}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-4 text-[11px] text-slate-500">
              This portal is monitored. All actions are logged for security and compliance.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
