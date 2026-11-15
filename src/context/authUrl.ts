// URL helpers for the browser-redirect parts of auth (Google sign-in), kept
// free of React and window so they can be unit tested.

const AUTH_ERROR_PARAM = "authError";

/**
 * The backend's Google sign-in endpoint. The browser navigates here (it is not
 * fetched); the backend sends it back to Auth:FrontendBaseUrl + returnUrl.
 */
export function googleLoginUrl(apiBase: string, returnUrl: string): string {
  const params = new URLSearchParams({ returnUrl });
  return `${apiBase}/auth/google/login?${params}`;
}

/**
 * Reads the `?authError=...` the backend appends after a failed Google sign-in.
 * `cleanedUrl` is the same URL without that parameter (path + query + hash),
 * for history.replaceState, or null when there was nothing to remove.
 */
export function takeAuthError(url: URL): {
  error: string | null;
  cleanedUrl: string | null;
} {
  const error = url.searchParams.get(AUTH_ERROR_PARAM);
  if (error === null) return { error: null, cleanedUrl: null };

  const cleaned = new URL(url);
  cleaned.searchParams.delete(AUTH_ERROR_PARAM);
  return {
    error,
    cleanedUrl: cleaned.pathname + cleaned.search + cleaned.hash,
  };
}
