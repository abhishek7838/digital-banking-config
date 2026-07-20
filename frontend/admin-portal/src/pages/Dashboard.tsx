// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

type PageResponse<T> = {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

type SuspiciousTxn = {
  transactionId: string;
  fromAccount: string | null;
  toAccount: string | null;
  amount: number;
  type: string;
  status: string;
  timestamp: string;
};

type DashboardMetrics = {
  totalUsers: number | null;
  totalAccounts: number | null;
  suspiciousCount: number | null;
  suspiciousRecent: SuspiciousTxn[];
};

const MIN_AMOUNT = 50000;

async function safeGet<T>(url: string): Promise<T | null> {
  try {
    const res = await axiosClient.get(url);
    return res.data as T;
  } catch (e) {
    return null;
  }
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: null,
    totalAccounts: null,
    suspiciousCount: null,
    suspiciousRecent: [],
  });

  const suspiciousCountUrl = useMemo(
    () => `/api/transactions/admin/suspicious/count?minAmount=${MIN_AMOUNT}`,
    []
  );

  const suspiciousListUrl = useMemo(
    () => `/api/transactions/admin/suspicious?minAmount=${MIN_AMOUNT}&page=0&size=5`,
    []
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1) Total Users: Calls your AdminMetricsController
      // Note: AdminUserCountResponse returns an object like { "total": 5 }
     // We add totalUsers to the typescript definition and the fallback check
const userCountRes = await safeGet<{ totalUsers?: number; total?: number; count?: number } | number>(`/api/users/admin/count`);
const totalUsers = typeof userCountRes === 'number' 
    ? userCountRes 
    : (userCountRes?.totalUsers ?? userCountRes?.total ?? userCountRes?.count ?? null);

      // 2) Total Accounts: Calls your new AdminAccountController
      // Note: ResponseEntity.ok(accountRepository.count()) returns a raw number
      const accountCountRes = await safeGet<number>(`/api/accounts/admin/count`);
      const totalAccounts = typeof accountCountRes === 'number' ? accountCountRes : null;

      // 3) Suspicious count
      const suspiciousCountRes = await safeGet<{ suspiciousCount: number }>(suspiciousCountUrl);
      const suspiciousCount = suspiciousCountRes?.suspiciousCount ?? null;

      // 4) Suspicious recent list (paged)
      const suspiciousPage = await safeGet<PageResponse<SuspiciousTxn>>(suspiciousListUrl);
      const suspiciousRecent = suspiciousPage?.content ?? [];

      if (!cancelled) {
        setMetrics({
          totalUsers,
          totalAccounts,
          suspiciousCount,
          suspiciousRecent,
        });

        // If all are null, likely auth/token issue or endpoint mismatch
        if (totalUsers === null && totalAccounts === null && suspiciousCount === null) {
          setErrorMsg(
            "Unable to load dashboard metrics. Verify admin token in localStorage and confirm the expected backend endpoints exist."
          );
        }
      }

      if (!cancelled) setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [suspiciousCountUrl, suspiciousListUrl]);

  const metricValue = (v: number | null) => (v === null ? "—" : v);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-50">Admin Dashboard</h1>
        <p className="text-sm text-slate-400">
          Live operational metrics from User, Account, and Transaction services.
        </p>
      </div>

      {errorMsg && (
        <div className="border border-amber-600/40 bg-amber-950/30 text-amber-200 text-sm p-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="banking-card border border-slate-800 bg-slate-950/70 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Total Users</div>
          <div className="text-2xl font-semibold mt-1 text-slate-50">
            {loading ? "Loading..." : metricValue(metrics.totalUsers)}
          </div>
        </div>

        <div className="banking-card border border-slate-800 bg-slate-950/70 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Total Accounts</div>
          <div className="text-2xl font-semibold mt-1 text-slate-50">
            {loading ? "Loading..." : metricValue(metrics.totalAccounts)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            If this shows —, add an internal/admin list endpoint in account-service.
          </div>
        </div>

        <div className="banking-card border border-slate-800 bg-slate-950/70 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Suspicious Txns (≥ {MIN_AMOUNT})</div>
          <div className="text-2xl font-semibold mt-1 text-slate-50">
            {loading ? "Loading..." : metricValue(metrics.suspiciousCount)}
          </div>
        </div>
      </div>

      <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-100">Recent Suspicious Transactions</div>
          <div className="text-xs text-slate-500">Top 5 (page 0)</div>
        </div>

        <div className="mt-3">
          {loading ? (
            <div className="text-sm text-slate-400">Loading suspicious transactions...</div>
          ) : metrics.suspiciousRecent.length === 0 ? (
            <div className="text-sm text-slate-400">No suspicious transactions found.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {metrics.suspiciousRecent.map((t) => (
                <div key={t.transactionId} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-100">
                      {t.type} • {t.status}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t.fromAccount ?? "—"} → {t.toAccount ?? "—"} • {new Date(t.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-50">{t.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
