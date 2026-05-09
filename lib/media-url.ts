/**
 * Media URLs for next/image and JSON-LD.
 * Local VPS files live under `/uploads/...`; legacy Cloudinary URLs in DB still pass through.
 */
export function optimizeMediaSrc(url: string): string {
  if (!url?.trim()) return url;
  const u = url.trim();

  if (u.startsWith("/uploads/")) return u;
  if (u.startsWith("/")) return u;

  // Legacy CDN rows — no transforms without Cloudinary
  if (u.includes("res.cloudinary.com")) return u;

  return u;
}

/** @deprecated Use optimizeMediaSrc */
export const cloudinaryOptimizeSrc = optimizeMediaSrc;
