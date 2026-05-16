/** Normalize pipe separators in titles — equal space on both sides of `|`. */
export function formatTitleSeparators(title: string): string {
  return title
    .split("|")
    .map((part) => part.trim())
    .join(" | ");
}
