"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Trash2, Check } from "lucide-react";

type Row = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
  read?: boolean;
};

export function ContactsAdmin() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/contacts");
    const data = (await res.json()) as Row[];
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function markRead(id: string, read: boolean) {
    await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    await refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-dark">
          Contact submissions
        </h1>
        <p className="text-sm text-brand-dark/60">
          Messages from the public contact form.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-brand-dark/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-3xl border border-brand-gold/15 bg-white/60 p-8 text-sm text-brand-dark/60">
          No messages yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((m) => (
            <li
              key={m._id}
              className="rounded-3xl border border-brand-gold/15 bg-white/70 p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cream text-brand-gold-deep">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-brand-dark">{m.name}</p>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-sm text-brand-gold-deep hover:underline"
                    >
                      {m.email}
                    </a>
                    <p className="mt-1 text-xs text-brand-dark/45">
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleString()
                        : ""}
                      {m.read ? " · Read" : " · Unread"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => markRead(m._id, !m.read)}
                    className="inline-flex items-center gap-1 rounded-xl border border-brand-gold/25 px-3 py-1.5 text-xs font-medium text-brand-dark"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m._id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-brand-dark/75">
                {m.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
