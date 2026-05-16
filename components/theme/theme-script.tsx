/** Inline script — runs before paint to avoid theme flash. */
export function ThemeScript() {
  const script = `
(function () {
  var key = ${JSON.stringify("podcast-theme")};
  var stored = null;
  try { stored = localStorage.getItem(key); } catch (e) {}
  var pref = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  var dark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  var root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(dark ? "dark" : "light");
  root.style.colorScheme = dark ? "dark" : "light";
})();
`.trim();

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
