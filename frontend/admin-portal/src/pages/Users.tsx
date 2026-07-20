// src/pages/Users.tsx
import { useState } from "react";
import { adminUsersApi } from "../api/adminUsersApi";
import type { UserProfileResponse } from "../api/adminUsersApi";

const Users: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setError(null);
    setUser(null);

    const value = email.trim();
    if (!value) {
      setError("Please enter an email to search.");
      return;
    }

    try {
      setLoading(true);
      const res = await adminUsersApi.getByEmail(value);
      setUser(res);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "User not found / API error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-slate-100">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="text-xs text-slate-400 mt-1">
          Search user profile by email using <code>/api/users/by-email</code>.
        </p>
      </div>

      <div className="banking-card border border-slate-800 bg-slate-950/70 p-4">
        <label className="text-xs text-slate-400">Email</label>
        <div className="mt-1 flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
            className="banking-input"
            placeholder="customer@email.com"
          />
          <button
            onClick={search}
            disabled={loading || email.trim().length === 0}
            className={`banking-button-primary w-36 ${
              loading || email.trim().length === 0 ? "opacity-70 cursor-not-allowed" : ""
            }`}
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

      {user && (
        <div className="mt-5 banking-card border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-sm font-semibold">User Profile</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-slate-400">ID</div>
              <div className="text-slate-100">{user.id}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Email</div>
              <div className="text-slate-100">{user.email}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">First Name</div>
              <div className="text-slate-100">{user.firstName}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Last Name</div>
              <div className="text-slate-100">{user.lastName}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
