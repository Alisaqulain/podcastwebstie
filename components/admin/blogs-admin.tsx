"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageField } from "@/components/admin/image-field";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  slug: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type BlogRow = FormValues & { _id: string; createdAt?: string };

export function BlogsAdmin() {
  const [items, setItems] = useState<BlogRow[]>([]);
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
    defaultValues: {
      title: "",
      content: "<p></p>",
      coverImage: "",
      slug: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const content = watch("content");
  const cover = watch("coverImage");

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/blogs");
    const data = (await res.json()) as BlogRow[];
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
      content: "<p></p>",
      coverImage: "",
      slug: "",
      seoTitle: "",
      seoDescription: "",
    });
  }

  function startEdit(b: BlogRow) {
    setEditingId(b._id);
    reset({
      title: b.title,
      content: b.content || "<p></p>",
      coverImage: b.coverImage || "",
      slug: b.slug || "",
      seoTitle: b.seoTitle || "",
      seoDescription: b.seoDescription || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      slug: values.slug?.trim() || undefined,
      seoTitle: values.seoTitle?.trim() || undefined,
      seoDescription: values.seoDescription?.trim() || undefined,
    };

    if (editingId) {
      await fetch(`/api/blogs/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    await refresh();
    startCreate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    await refresh();
    if (editingId === id) startCreate();
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-dark">
            Blog
          </h1>
          <p className="text-sm text-brand-dark/60">
            Rich text with SEO fields. Slug auto-generates from the title if empty.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-dark px-4 py-2 text-sm font-semibold text-brand-cream"
        >
          <Plus className="h-4 w-4" />
          New article
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-brand-gold/15 bg-white/70 p-6 shadow-sm"
      >
        <p className="text-sm font-semibold text-brand-dark">
          {editingId ? "Edit article" : "Create article"}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">Title</label>
            <input
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("title")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-dark">
              Slug (optional)
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              placeholder="auto from title"
              {...register("slug")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-dark">
              SEO title
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("seoTitle")}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">
              SEO description
            </label>
            <textarea
              rows={2}
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("seoDescription")}
            />
          </div>
          <div className="md:col-span-2">
            <ImageField
              label="Cover image"
              value={cover || ""}
              onChange={(url) => setValue("coverImage", url)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">Content</label>
            <div className="mt-2">
              <RichTextEditor
                value={content || ""}
                onChange={(html) => setValue("content", html)}
              />
            </div>
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
          {editingId ? "Save article" : "Publish article"}
        </button>
      </form>

      <div className="rounded-3xl border border-brand-gold/15 bg-white/60">
        <div className="border-b border-brand-gold/10 px-6 py-4">
          <p className="text-sm font-semibold text-brand-dark">All articles</p>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-brand-dark/60">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-brand-dark/60">No articles yet.</p>
        ) : (
          <ul className="divide-y divide-brand-gold/10">
            {items.map((b) => (
              <li
                key={b._id}
                className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-brand-dark">{b.title}</p>
                  <p className="mt-1 text-xs text-brand-dark/50">/{b.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(b)}
                    className="inline-flex items-center gap-1 rounded-xl border border-brand-gold/25 px-3 py-1.5 text-xs font-medium text-brand-dark"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(b._id)}
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
