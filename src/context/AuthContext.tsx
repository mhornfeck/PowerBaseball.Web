import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  ApiError,
  AuthService,
  OpenAPI,
  type CurrentUserResponse,
} from "../api/generated";
import { googleLoginUrl, takeAuthError } from "./authUrl";

// The backend uses cookie sessions: signing in sets a cookie, and GET /auth/me
// is the only way to learn who (if anyone) is signed in. Nothing is stored here.

export type AuthStatus = "loading" | "signedIn" | "signedOut";

type AuthContextType = {
  status: AuthStatus;
  user: CurrentUserResponse | null;
  /** A message to show on the sign-in screen, e.g. after a failed Google sign-in. */
  error: string | null;
  clearError: () => void;
  /** Emails a sign-in code; creates the account on first use. Throws ApiError on failure. */
  sendCode: (email: string) => Promise<void>;
  /** Signs in with an emailed code. Throws ApiError on failure (e.g. a wrong code). */
  verifyCode: (email: string, code: string) => Promise<void>;
  /** Leaves the app for Google; the backend redirects back to `returnUrl`. */
  loginWithGoogle: (returnUrl?: string) => void;
  logout: () => Promise<void>;
  /** Call when an API request returns 401, i.e. the session expired. */
  handleUnauthorized: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_ERROR_MESSAGE = "Google sign-in didn't work. Please try again.";
const UNREACHABLE_MESSAGE = "Couldn't reach the server. Please try again.";

function isUnauthorized(err: unknown) {
  return err instanceof ApiError && err.status === 401;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signedIn = useCallback((me: CurrentUserResponse) => {
    setUser(me);
    setStatus("signedIn");
    setError(null);
  }, []);

  const signedOut = useCallback((message: string | null = null) => {
    setUser(null);
    setStatus("signedOut");
    setError(message);
  }, []);

  useEffect(() => {
    // A failed Google sign-in comes back as ?authError=...; take it off the
    // URL so a refresh doesn't show it again.
    const redirect = takeAuthError(new URL(window.location.href));
    if (redirect.cleanedUrl !== null) {
      console.warn("Google sign-in failed:", redirect.error);
      window.history.replaceState(window.history.state, "", redirect.cleanedUrl);
    }
    const redirectMessage = redirect.error !== null ? GOOGLE_ERROR_MESSAGE : null;

    let cancelled = false;

    AuthService.getAuthMe()
      .then((me) => {
        if (!cancelled) signedIn(me);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          signedOut(redirectMessage);
        } else {
          console.error("GET /auth/me failed:", err);
          signedOut(UNREACHABLE_MESSAGE);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [signedIn, signedOut]);

  const sendCode = useCallback(async (email: string) => {
    await AuthService.postAuthEmailSend({ email });
  }, []);

  const verifyCode = useCallback(
    async (email: string, code: string) => {
      signedIn(await AuthService.postAuthEmailVerify({ email, code }));
    },
    [signedIn],
  );

  const loginWithGoogle = useCallback((returnUrl = "/") => {
    window.location.assign(googleLoginUrl(OpenAPI.BASE, returnUrl));
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.postAuthLogout();
    } catch (err) {
      // Sign out locally regardless; at worst the cookie outlives the UI state.
      console.error("POST /auth/logout failed:", err);
    }
    signedOut();
  }, [signedOut]);

  const handleUnauthorized = useCallback(() => signedOut(), [signedOut]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        error,
        clearError,
        sendCode,
        verifyCode,
        loginWithGoogle,
        logout,
        handleUnauthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is intentionally colocated with its provider
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
