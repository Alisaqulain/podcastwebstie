"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Row = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  topic: string;
  packageId: string;
  packageTitle: string;
  date: string;
  time: string;
  amount: number;
  paymentStatus: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  createdAt?: string;
};

export function BookingsAdmin() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");

  async function refresh() {
    setLoading(true);
    const q = new URLSearchParams();
    if (from.trim()) q.set("from", from.trim());
    if (to.trim()) q.set("to", to.trim());
    if (status.trim()) q.set("status", status.trim());
    const res = await fetch(`/api/bookings?${q.toString()}`);
    const data = (await res.json()) as Row[];
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- manual "Apply filters"
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-dark">
          Bookings &amp; payments
        </h1>
        <p className="mt-2 text-sm text-brand-dark/60">
          Filter by booking date (YYYY-MM-DD) and payment status.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-3xl border border-brand-gold/15 bg-white/70 p-4 shadow-sm">
        <div>
          <label className="text-xs font-medium text-brand-dark/70">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 block rounded-xl border border-brand-gold/20 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-dark/70">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block rounded-xl border border-brand-gold/20 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-brand-dark/70">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block rounded-xl border border-brand-gold/20 bg-white px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-2xl bg-brand-dark px-4 py-2.5 text-sm font-medium text-brand-cream"
        >
          Apply filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold-deep" />
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-gold/25 bg-white/50 px-6 py-12 text-center text-sm text-brand-dark/55">
          No bookings match these filters.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-gold/12 bg-white/65 shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-gold/15 bg-brand-cream/50 text-xs uppercase tracking-wide text-brand-dark/55">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Package</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Payment ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gold/10">
              {items.map((r) => (
                <tr key={r._id} className="text-brand-dark/85">
                  <td className="whitespace-nowrap px-4 py-3">
                    {r.date}{" "}
                    <span className="text-brand-dark/50">{r.time}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-brand-dark">{r.name}</div>
                    <div className="text-xs text-brand-dark/55">{r.email}</div>
                    <div className="text-xs text-brand-dark/45">{r.phone}</div>
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    <div className="truncate font-medium">{r.packageTitle}</div>
                    <div className="truncate text-xs text-brand-dark/50">
                      {r.businessName}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                    {r.paymentStatus === "paid"
                      ? `₹${Number(r.amount).toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        r.paymentStatus === "paid"
                          ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900"
                          : r.paymentStatus === "pending"
                            ? "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900"
                            : "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-900"
                      }
                    >
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs text-brand-dark/60">
                    {r.razorpay_payment_id || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
