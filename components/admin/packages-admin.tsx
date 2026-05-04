"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2, GripVertical } from "lucide-react";

const schema = z.object({
  title: z.string().min(1),
  description: z.string(),
  priceInr: z.string().min(1),
  discountInr: z.string().optional(),
  badge: z.string().optional(),
  active: z.boolean(),
  sortOrder: z.string().optional(),
  features: z.array(z.object({ value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

type Row = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  features: string[];
  badge?: string;
  active: boolean;
  sortOrder: number;
};

function paiseFromInr(s: string) {
  const n = Number.parseFloat(s.replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

export function PackagesAdmin() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priceInr: "",
      discountInr: "",
      badge: "",
      active: true,
      sortOrder: "",
      features: [{ value: "" }],
    },
  });

  const { fields, append, remove: removeFeatureRow } = useFieldArray({
    control,
    name: "features",
  });

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/packages");
    const data = (await res.json()) as Row[];
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  function startCreate() {
    setEditingId(null);
    reset({
      title: "",
      description: "",
      priceInr: "",
      discountInr: "",
      badge: "",
      active: true,
      sortOrder: "",
      features: [{ value: "" }],
    });
  }

  function startEdit(r: Row) {
    setEditingId(r._id);
    reset({
      title: r.title,
      description: r.description || "",
      priceInr: (r.price / 100).toFixed(2).replace(/\.00$/, ""),
      discountInr:
        r.discountPrice != null && r.discountPrice > 0
          ? (r.discountPrice / 100).toFixed(2).replace(/\.00$/, "")
          : "",
      badge: r.badge || "",
      active: r.active !== false,
      sortOrder: String(r.sortOrder ?? ""),
      features:
        r.features?.length > 0
          ? r.features.map((f) => ({ value: f }))
          : [{ value: "" }],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(values: FormValues) {
    const price = paiseFromInr(values.priceInr);
    if (price == null || price < 100) {
      alert("Enter a valid price in INR (minimum ₹1).");
      return;
    }
    let discountPaise: number | null = null;
    if (values.discountInr?.trim()) {
      const d = paiseFromInr(values.discountInr);
      if (d != null && d > 0 && d < price) discountPaise = d;
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      price,
      discountPrice: discountPaise,
      features: values.features.map((f) => f.value.trim()).filter(Boolean),
      badge: values.badge?.trim() || "",
      active: values.active,
      sortOrder: values.sortOrder?.trim()
        ? Math.round(Number(values.sortOrder))
        : Date.now(),
    };

    if (editingId) {
      await fetch(`/api/packages/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    await refresh();
    startCreate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/packages/${id}`, { method: "DELETE" });
    await refresh();
    if (editingId === id) startCreate();
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-dark">
            Packages
          </h1>
          <p className="text-sm text-brand-dark/60">
            Prices stored in paise; enter amounts in INR (rupees) below.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-2xl border border-brand-gold/25 bg-white px-4 py-2 text-sm font-medium text-brand-dark shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New package
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl border border-brand-gold/15 bg-white/70 p-6 shadow-sm md:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
          {editingId ? "Edit package" : "Create package"}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">Title</label>
            <input
              className="mt-1 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("title")}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">
              Description
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("description")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-dark">
              Price (INR)
            </label>
            <input
              className="mt-1 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              placeholder="4999"
              {...register("priceInr")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-dark">
              Discount price (INR, optional)
            </label>
            <input
              className="mt-1 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              placeholder="3999"
              {...register("discountInr")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-dark">Badge</label>
            <input
              className="mt-1 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              placeholder="Most Popular"
              {...register("badge")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-dark">
              Sort order
            </label>
            <input
              className="mt-1 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              placeholder="10"
              {...register("sortOrder")}
            />
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <input type="checkbox" id="pkg-active" {...register("active")} />
            <label htmlFor="pkg-active" className="text-sm text-brand-dark">
              Active (visible on site)
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-brand-dark">Features</label>
          <div className="mt-2 space-y-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <GripVertical className="mt-2.5 h-4 w-4 shrink-0 text-brand-dark/25" />
                <input
                  className="flex-1 rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
                  placeholder="Feature"
                  {...register(`features.${i}.value` as const)}
                />
                <button
                  type="button"
                  onClick={() => removeFeatureRow(i)}
                  className="rounded-xl border border-brand-gold/20 px-3 text-brand-dark/60 hover:bg-red-50"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="text-sm font-medium text-brand-gold-deep hover:underline"
            >
              + Add feature
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-2xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-brand-dark shadow-md disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          {editingId ? "Save changes" : "Create package"}
        </button>
      </form>

      <div>
        <h2 className="font-display text-lg font-semibold text-brand-dark">
          All packages
        </h2>
        {loading ? (
          <p className="mt-4 text-sm text-brand-dark/50">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-brand-dark/55">No packages yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-brand-gold/10 rounded-2xl border border-brand-gold/12 bg-white/60">
            {items.map((r) => (
              <li
                key={r._id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
              >
                <div>
                  <p className="font-medium text-brand-dark">{r.title}</p>
                  <p className="text-xs text-brand-dark/50">
                    ₹{(r.price / 100).toLocaleString("en-IN")}
                    {r.discountPrice ? (
                      <span className="ml-2 text-emerald-700">
                        → ₹{(r.discountPrice / 100).toLocaleString("en-IN")}
                      </span>
                    ) : null}
                    {!r.active ? (
                      <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-amber-900">
                        inactive
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="rounded-xl border border-brand-gold/20 p-2 hover:bg-brand-gold/10"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(r._id)}
                    className="rounded-xl border border-brand-gold/20 p-2 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
