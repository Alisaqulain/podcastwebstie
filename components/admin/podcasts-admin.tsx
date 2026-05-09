"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { ImageField } from "@/components/admin/image-field";
import type { PodcastApi } from "@/components/podcast/podcast-directory";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  youtubeLink: z.string().min(1),
  thumbnail: z.string().optional(),
  localPreviewUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PodcastsAdmin() {
  const [items, setItems] = useState<PodcastApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const previewFileRef = useRef<HTMLInputElement>(null);

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
      description: "",
      youtubeLink: "",
      thumbnail: "",
      localPreviewUrl: "",
    },
  });

  const thumb = watch("thumbnail");

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/podcasts");
    const data = (await res.json()) as PodcastApi[];
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
      youtubeLink: "",
      thumbnail: "",
      localPreviewUrl: "",
    });
  }

  function startEdit(p: PodcastApi) {
    setEditingId(p._id);
    reset({
      title: p.title,
      description: p.description,
      youtubeLink: p.youtubeLink,
      thumbnail: p.thumbnail || "",
      localPreviewUrl: p.localPreviewUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(values: FormValues) {
    if (editingId) {
      await fetch(`/api/podcasts/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch("/api/podcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    await refresh();
    startCreate();
  }

  async function onPreviewVideoPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingPreview(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/video", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as {
        previewUrl?: string;
        url?: string;
        error?: string;
      };
      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }
      const url = data.previewUrl || data.url;
      if (url) setValue("localPreviewUrl", url);
    } finally {
      setUploadingPreview(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this episode?")) return;
    await fetch(`/api/podcasts/${id}`, { method: "DELETE" });
    await refresh();
    if (editingId === id) startCreate();
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-dark">
            Podcasts
          </h1>
          <p className="text-sm text-brand-dark/60">
            YouTube links auto-generate thumbnails when left blank.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-dark px-4 py-2 text-sm font-semibold text-brand-cream"
        >
          <Plus className="h-4 w-4" />
          New episode
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-brand-gold/15 bg-white/70 p-6 shadow-sm"
      >
        <p className="text-sm font-semibold text-brand-dark">
          {editingId ? "Edit episode" : "Create episode"}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">Title</label>
            <input
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("title")}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">
              Description
            </label>
            <textarea
              rows={4}
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("description")}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">
              YouTube URL
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("youtubeLink")}
            />
          </div>
          <div className="md:col-span-2">
            <ImageField
              label="Thumbnail (optional)"
              value={thumb || ""}
              onChange={(url) => setValue("thumbnail", url)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-brand-dark">
              Local preview MP4 (optional)
            </label>
            <p className="mt-1 text-xs text-brand-dark/55">
              Stored on the VPS under{" "}
              <code className="rounded bg-brand-gold/10 px-1">/uploads</code>.
              Upload generates a 30s mute clip when ffmpeg is installed; must match
              the same YouTube episode URL above to attach when using API sync.
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                className="w-full flex-1 rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
                placeholder="/uploads/podcasts/previews/…"
                {...register("localPreviewUrl")}
              />
              <input
                ref={previewFileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={onPreviewVideoPick}
              />
              <button
                type="button"
                disabled={uploadingPreview}
                onClick={() => previewFileRef.current?.click()}
                className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-brand-gold/25 bg-white px-4 py-2.5 text-sm font-medium text-brand-dark disabled:opacity-60"
              >
                {uploadingPreview ? "Uploading…" : "Upload video"}
              </button>
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
          {editingId ? "Save changes" : "Publish episode"}
        </button>
      </form>

      <div className="rounded-3xl border border-brand-gold/15 bg-white/60">
        <div className="border-b border-brand-gold/10 px-6 py-4">
          <p className="text-sm font-semibold text-brand-dark">All episodes</p>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-brand-dark/60">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-brand-dark/60">No episodes yet.</p>
        ) : (
          <ul className="divide-y divide-brand-gold/10">
            {items.map((p) => (
              <li
                key={p._id}
                className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-brand-dark">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-brand-dark/55">
                    {p.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="inline-flex items-center gap-1 rounded-xl border border-brand-gold/25 px-3 py-1.5 text-xs font-medium text-brand-dark"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p._id)}
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
