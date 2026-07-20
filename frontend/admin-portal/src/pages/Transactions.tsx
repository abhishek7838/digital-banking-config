import { useEffect, useMemo, useState } from "react";
import { adminTransactionsApi } from "../api/adminTransactionsApi";
import type { PageResponse, SuspiciousTxn } from "../api/adminTransactionsApi";


const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

const Money = ({ value }: { value: number }) => (
  <span className="font-semibold text-slate-50">{value.toFixed(2)}</span>
);

const Badge = ({ text }: { text: string }) => (
  <span className="px-2 py-1 rounded-full text-[11px] border border-slate-700 bg-slate-900/60 text-slate-200">
    {text}
  </span>
);

const Transactions: React.FC = () => {
  const [minAmount, setMinAmount] = useState<number>(50000);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(5);

  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<PageResponse<SuspiciousTxn> | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = data?.totalPages ?? 0;

  const params = useMemo(() => ({ minAmount, page, size }), [minAmount, page, size]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pageData, suspiciousCount] = await Promise.all([
        adminTransactionsApi.getSuspicious(params),
        adminTransactionsApi.getSuspiciousCount(minAmount),
      ]);
      setData(pageData);
      setCount(suspiciousCount);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ??
          "Failed to load transactions. Check gateway + transaction-service logs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // reload whenever filters/page changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minAmount, page, size]);

  const onApply = () => {
    // when minAmount changes, reset to page 0
    setPage(0);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Transactions</h1>
          <p className="text-sm text-slate-400">
            Suspicious transaction monitoring (threshold-based).
          </p>
        </div>

        <button
          onClick={load}
          disabled={loading}
          className="banking-button-secondary px-4 py-2 text-sm"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="banking-card border border-slate-800 bg-slate-950/70 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Min Amount
            </label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(Number(e.target.value || 0))}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 outline-none"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Page Size</label>
            <select
              value={size}
              onChange={(e) => {
                setPage(0);
                setSize(Number(e.target.value));
              }}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              onClick={onApply}
              disabled={loading}
              className="banking-button-primary px-4 py-2 text-sm"
            >
              Apply
            </button>

            <div className="text-sm text-slate-300 flex items-center">
              Suspicious Count:&nbsp;
              <span className="font-semibold text-slate-50">
                {loading ? "..." : count}
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-xs rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="banking-card border border-slate-800 bg-slate-950/70 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="text-sm text-slate-200 font-medium">
            Suspicious Transactions (≥ {minAmount})
          </div>

          <div className="text-xs text-slate-400">
            Page {data ? data.number + 1 : 1} / {totalPages || 1}
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-400 border-b border-slate-800">
              <tr>
                <th className="text-left px-4 py-3">Txn</th>
                <th className="text-left px-4 py-3">From → To</th>
                <th className="text-left px-4 py-3">Type / Status</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Time</th>
              </tr>
            </thead>

            <tbody className="text-slate-200">
              {loading && (
                <tr>
                  <td className="px-4 py-4 text-slate-400" colSpan={5}>
                    Loading suspicious transactions...
                  </td>
                </tr>
              )}

              {!loading && (data?.content?.length ?? 0) === 0 && (
                <tr>
                  <td className="px-4 py-4 text-slate-400" colSpan={5}>
                    No suspicious transactions found for current threshold.
                  </td>
                </tr>
              )}

              {!loading &&
                data?.content?.map((t) => {
                  const key = t.transactionId ?? String(t.id ?? Math.random());
                  const time = t.timestamp ?? t.createdAt;

                  return (
                    <tr key={key} className="border-b border-slate-900/70">
                      <td className="px-4 py-3">
                        <div className="text-slate-50 font-medium">
                          {t.transactionId ?? `#${t.id ?? "—"}`}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-300">
                        {t.fromAccount ?? "—"} → {t.toAccount ?? "—"}
                      </td>

                      <td className="px-4 py-3 flex gap-2 items-center">
                        <Badge text={t.type ?? "—"} />
                        <Badge text={t.status ?? "—"} />
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Money value={t.amount} />
                      </td>

                      <td className="px-4 py-3 text-slate-300">
                        {formatDate(time)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Total: {data?.totalElements ?? 0}
          </div>

          <div className="flex gap-2">
            <button
              className="banking-button-ghost !px-3 !py-1 text-[11px]"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={loading || page <= 0}
            >
              Prev
            </button>

            <button
              className="banking-button-ghost !px-3 !py-1 text-[11px]"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading || (totalPages !== 0 && page >= totalPages - 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

