"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { cloudinaryOptimizeSrc } from "@/lib/cloudinary-url";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export function ImageField({ label, value, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Upload failed");
        return;
      }
      if (data.url) onChange(data.url);
    } catch {
      setErr("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-brand-dark">{label}</label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className="w-full flex-1 rounded-2xl border border-brand-gold/20 bg-white px-4 py-2.5 text-sm outline-none ring-brand-gold/30 focus:ring-2"
        />
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-brand-gold/25 bg-brand-dark px-4 py-2.5 text-sm font-medium text-brand-cream hover:bg-brand-dark/90">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>
      </div>
      {err ? <p className="mt-1 text-xs text-red-600">{err}</p> : null}

      {value.trim() ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-brand-dark/50">
            Preview before publish — images are resized on upload and served as WebP/AVIF when
            supported.
          </p>
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-brand-gold/20 shadow-card">
            {/* Admin-only preview: any HTTPS URL may be pasted; avoid next/image remote allowlist issues */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cloudinaryOptimizeSrc(value.trim(), { width: 960 })}
              alt={`Preview: ${label}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
