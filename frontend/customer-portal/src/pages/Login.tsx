import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      // token/user already stored in localStorage by context
      if (!rememberMe) {
        // optional: if you want "no remember", you can move storage to sessionStorage instead.
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null);

      setError(apiMsg ?? "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* keep your left UI as-is */}
      <div className="auth-left">
        {/* ... */}
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {/* ... header ... */}

          {error && (
            <div
              style={{
                marginBottom: 10,
                padding: "8px 10px",
                borderRadius: 10,
                fontSize: 12,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid #b91c1c",
                color: "#fecaca",
              }}
            >
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="form-row">
              <label className="form-checkbox-row">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
              <span className="link-muted">Forgot password?</span>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !email || !password}
            >
              {loading ? "Signing in..." : "Sign in securely"}
            </button>
          </form>

          <div className="auth-footer-row">
            New to Digital Bank?{" "}
            <span onClick={() => navigate("/register")}>Create a customer account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
