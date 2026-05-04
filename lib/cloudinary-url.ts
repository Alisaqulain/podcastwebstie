/**
 * Append delivery transformations to Cloudinary URLs for WebP/AVIF (f_auto),
 * compression (q_auto), and sensible width caps for next/image.
 */
export function cloudinaryOptimizeSrc(
  url: string,
  opts?: { width?: number }
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const base = url.slice(0, idx + marker.length);
  const rest = url.slice(idx + marker.length);
  const firstSeg = rest.split("/")[0] ?? "";

  // Already has explicit transformations (not just v123...)
  if (
    firstSeg.includes(",") ||
    /^(f_|q_|c_|w_|h_|ar_)/.test(firstSeg)
  ) {
    return url;
  }

  const w = opts?.width ?? 1920;
  const transforms = `f_auto,q_auto,w_${w},c_limit`;
  return `${base}${transforms}/${rest}`;
}
