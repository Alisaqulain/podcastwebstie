"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { ImageField } from "@/components/admin/image-field";

const schema = z.object({
  name: z.string().min(1),
  message: z.string().min(1),
  image: z.string().optional(),
  rating: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Row = FormValues & { _id: string; rating?: number };

export function TestimonialsAdmin() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", message: "", image: "", rating: "" },
  });

  const image = watch("image");

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    const data = (await res.json()) as Row[];
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  function startCreate() {
    setEditingId(null);
    reset({ name: "", message: "", image: "", rating: "" });
  }

  function startEdit(r: Row) {
    setEditingId(r._id);
    reset({
      name: r.name,
      message: r.message,
      image: r.image || "",
      rating: r.rating != null ? String(r.rating) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(values: FormValues) {
    const ratingVal = values.rating?.trim();
    const payload: {
      name: string;
      message: string;
      image?: string;
      rating?: number | null;
    } = {
      name: values.name,
      message: values.message,
      image: values.image,
    };
    if (ratingVal) {
      const r = Number(ratingVal);
      if (r >= 1 && r <= 5) payload.rating = r;
    } else if (editingId) {
      payload.rating = null;
    }
    if (editingId) {
      await fetch(`/api/testimonials/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    await refresh();
    startCreate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    await refresh();
    if (editingId === id) startCreate();
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-dark">
            Testimonials
          </h1>
          <p className="text-sm text-brand-dark/60">
            Client photos can be uploaded to the server (stored under /uploads).
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-dark px-4 py-2 text-sm font-semibold text-brand-cream"
        >
          <Plus className="h-4 w-4" />
          New testimonial
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-brand-gold/15 bg-white/70 p-6 shadow-sm"
      >
        <p className="text-sm font-semibold text-brand-dark">
          {editingId ? "Edit testimonial" : "Create testimonial"}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-brand-dark">Name</label>
            <input
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("name")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-dark">
              Rating (1–5, optional)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              step={1}
              placeholder="5"
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("rating")}
            />
          </div>
          <div className="md:col-span-2">
            <ImageField
              label="Portrait (optional)"
              value={image || ""}
              onChange={(url) => setValue("image", url)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">
              Message
            </label>
            <textarea
              rows={4}
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("message")}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-2xl bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          {editingId ? "Save" : "Publish"}
        </button>
      </form>

      <div className="rounded-3xl border border-brand-gold/15 bg-white/60">
        <div className="border-b border-brand-gold/10 px-6 py-4">
          <p className="text-sm font-semibold text-brand-dark">All entries</p>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-brand-dark/60">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-brand-dark/60">No testimonials yet.</p>
        ) : (
          <ul className="divide-y divide-brand-gold/10">
            {items.map((r) => (
              <li
                key={r._id}
                className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-brand-dark">{r.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-brand-dark/55">
                    {r.message}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="inline-flex items-center gap-1 rounded-xl border border-brand-gold/25 px-3 py-1.5 text-xs font-medium text-brand-dark"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(r._id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
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
