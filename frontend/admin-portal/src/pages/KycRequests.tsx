// src/pages/KycRequests.tsx
import { useEffect, useMemo, useState } from "react";
import { adminKycApi } from "../api/adminKycApi";
import type { KycRequest, KycStatus } from "../api/adminKycApi";

const statusPill = (status: KycStatus) => {
  if (status === "PENDING") return "bg-amber-500/10 text-amber-300 border-amber-500/30";
  if (status === "APPROVED") return "bg-green-500/10 text-green-300 border-green-500/30";
  return "bg-red-500/10 text-red-300 border-red-500/30";
};

const KycRequests: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [list, setList] = useState<KycRequest[]>([]);
  const [query, setQuery] = useState("");

  const [rejectUserId, setRejectUserId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((x) => {
      return (
        String(x.userId).includes(q) ||
        x.email.toLowerCase().includes(q) ||
        (x.fullName ?? "").toLowerCase().includes(q) ||
        (x.mobile ?? "").toLowerCase().includes(q)
      );
    });
  }, [list, query]);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await adminKycApi.getPending();
      // Defensive: ensure each item has a numeric userId
      const safe = (data ?? []).filter((x) => typeof x.userId === "number" && !Number.isNaN(x.userId));
      setList(safe);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to load pending KYC requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (userId: number) => {
    if (typeof userId !== "number" || Number.isNaN(userId)) {
      setError("Invalid userId. Please refresh and try again.");
      return;
    }

    setError(null);
    setActionLoading(userId);
    try {
      await adminKycApi.decide(userId, { status: "APPROVED", remarks: "KYC documents verified" });
      setList((prev) => prev.filter((x) => x.userId !== userId));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Approve failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async () => {
    if (rejectUserId == null) return;

    if (typeof rejectUserId !== "number" || Number.isNaN(rejectUserId)) {
      setError("Invalid userId. Please refresh and try again.");
      return;
    }

    setError(null);
    setActionLoading(rejectUserId);
    try {
      await adminKycApi.decide(rejectUserId, {
        status: "REJECTED",
        remarks: rejectReason.trim() || undefined,
      });
      setList((prev) => prev.filter((x) => x.userId !== rejectUserId));
      setRejectUserId(null);
      setRejectReason("");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Reject failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const closeRejectModal = () => {
    setRejectUserId(null);
    setRejectReason("");
  };

  return (
    <div className="text-slate-100">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">KYC Requests</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review pending KYC and approve/reject. (Backend: <code>/api/users/kyc/pending</code>)
        </p>
      </div>

      <div className="banking-card border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex-1">
            <label className="text-xs text-slate-400">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by userId, email, name, mobile"
              className="banking-input mt-1"
            />
          </div>

          <button
            onClick={load}
            disabled={loading || actionLoading !== null}
            className={`banking-button-ghost md:w-36 ${
              loading || actionLoading !== null ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-xs rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 px-3 py-2">
            {error}
          </div>
        )}

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/40 text-slate-300">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Mobile</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>

            <tbody className="text-slate-200">
              {loading ? (
                <tr>
                  <td className="p-3 text-slate-400" colSpan={5}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-400" colSpan={5}>
                    No pending KYC requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const rowKey = `kyc-${row.userId}-${row.email}`; // stable + unique even if email duplicates
                  const isRowBusy = actionLoading === row.userId;

                  return (
                    <tr key={rowKey} className="border-t border-slate-800">
                      <td className="p-3">
                        <div className="font-semibold">{row.fullName}</div>
                        <div className="text-xs text-slate-400">ID: {row.userId}</div>
                      </td>

                      <td className="p-3">{row.email}</td>
                      <td className="p-3">{row.mobile ?? "—"}</td>

                      <td className="p-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full border text-xs ${statusPill(
                            row.kycStatus
                          )}`}
                        >
                          {row.kycStatus}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => approve(row.userId)}
                            disabled={actionLoading !== null}
                            className={`banking-button-ghost ${isRowBusy ? "opacity-70 cursor-not-allowed" : ""}`}
                          >
                            {isRowBusy ? "Working..." : "Approve"}
                          </button>

                          <button
                            onClick={() => setRejectUserId(row.userId)}
                            disabled={actionLoading !== null}
                            className={`banking-button-ghost border-red-500/40 text-red-200 hover:bg-red-500/10 ${
                              isRowBusy ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectUserId != null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="text-lg font-semibold">Reject KYC</div>
            <div className="text-xs text-slate-400 mt-1">
              User ID: <span className="text-slate-200">{rejectUserId}</span>
            </div>

            <div className="mt-3">
              <label className="text-xs text-slate-400">Reason (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="banking-input mt-1 h-24"
                placeholder="e.g., Document mismatch / Photo unclear / Address proof invalid"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeRejectModal}
                className="banking-button-ghost"
                disabled={actionLoading !== null}
              >
                Cancel
              </button>

              <button
                onClick={reject}
                className={`banking-button-ghost border-red-500/40 text-red-200 hover:bg-red-500/10 ${
                  actionLoading === rejectUserId ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={actionLoading !== null}
              >
                {actionLoading === rejectUserId ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycRequests;
