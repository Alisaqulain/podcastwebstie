/**
 * Safely parse admin API responses — live servers often return HTML
 * (nginx 413/502, login pages, 404) instead of JSON.
 */
export async function parseApiJson<T>(
  res: Response
): Promise<
  | { ok: true; data: T }
  | { ok: false; error: string; status: number }
> {
  const status = res.status;
  const contentType = res.headers.get("content-type") ?? "";
  let text: string;

  try {
    text = await res.text();
  } catch {
    return {
      ok: false,
      status,
      error: `Could not read server response (HTTP ${status}).`,
    };
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return {
      ok: false,
      status,
      error:
        status === 401
          ? "Session expired — sign in to admin again."
          : `Empty response from server (HTTP ${status}).`,
    };
  }

  const looksJson =
    contentType.includes("application/json") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[");

  if (looksJson) {
    try {
      return { ok: true, status, data: JSON.parse(trimmed) as T };
    } catch {
      /* fall through — mislabeled HTML or truncated body */
    }
  }

  if (trimmed.startsWith("<")) {
    if (status === 401 || status === 403) {
      return {
        ok: false,
        status,
        error: "Session expired — sign in to admin again.",
      };
    }
    if (status === 413) {
      return {
        ok: false,
        status,
        error:
          "File too large for the server. Use a smaller image or increase nginx client_max_body_size.",
      };
    }
    if (status === 404) {
      return {
        ok: false,
        status,
        error:
          "Upload API not found (404). Redeploy the app and ensure /api/upload is available.",
      };
    }
    if (status === 502 || status === 504) {
      return {
        ok: false,
        status,
        error:
          "Server gateway error — check that Node/PM2 is running and nginx proxies to the app.",
      };
    }
    return {
      ok: false,
      status,
      error: `Server returned an HTML error page (HTTP ${status}), not JSON. Check hosting logs and nginx config.`,
    };
  }

  return {
    ok: false,
    status,
    error: trimmed.slice(0, 200) || `Unexpected response (HTTP ${status}).`,
  };
}
