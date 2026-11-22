import { useState, type FormEvent } from "react";
import Button from "../components/button/Button";
import TextInput from "../components/text-input/TextInput";
import { useAuth } from "../context/AuthContext";
import { sendCodeErrorMessage, verifyCodeErrorMessage } from "./loginErrors";
import "./LoginScreen.css";

type LoginStep = "choose" | "enter-code";

export default function LoginScreen() {
  const { error: authError, clearError, sendCode, verifyCode, loginWithGoogle } =
    useAuth();

  const [step, setStep] = useState<LoginStep>("choose");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Errors from this screen's own requests win over one carried in from
  // AuthProvider (a failed Google redirect or an unreachable server).
  const shownError = error ?? authError;

  const resetMessages = () => {
    setError(null);
    setNotice(null);
    clearError();
  };

  const requestCode = async () => {
    resetMessages();
    setBusy(true);
    try {
      await sendCode(email.trim());
      return true;
    } catch (err) {
      setError(sendCodeErrorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const onSubmitEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (await requestCode()) {
      setCode("");
      setStep("enter-code");
    }
  };

  const onResend = async () => {
    if (await requestCode()) setNotice("We sent a new code.");
  };

  const onSubmitCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    resetMessages();
    setBusy(true);
    try {
      // On success AuthProvider switches to signedIn and this screen unmounts.
      await verifyCode(email.trim(), code.trim());
    } catch (err) {
      setError(verifyCodeErrorMessage(err));
      setBusy(false);
    }
  };

  const onChangeEmail = () => {
    resetMessages();
    setCode("");
    setStep("choose");
  };

  const onGoogle = () => {
    resetMessages();
    setBusy(true);
    loginWithGoogle();
  };

  return (
    <div className="login-screen">
      <img
        className="login-logo"
        src="/images/title-screen.png"
        alt="Power Baseball 3000"
      />
      <h2>Sign in</h2>

      {shownError && (
        <p className="login-message login-error" role="alert">
          {shownError}
        </p>
      )}
      {notice && (
        <p className="login-message" role="status">
          {notice}
        </p>
      )}

      {step === "choose" && (
        <div className="login-options">
          <Button variant="primary" onClick={onGoogle} disabled={busy}>
            Continue with Google
          </Button>

          <div className="login-divider">or</div>

          <form className="login-form" onSubmit={onSubmitEmail}>
            <TextInput
              type="email"
              value={email}
              placeholder="Email address"
              autoComplete="email"
              onChange={setEmail}
              disabled={busy}
            />
            <Button
              variant="transparent"
              type="submit"
              disabled={busy || !email.trim()}
            >
              Email me a code
            </Button>
          </form>
        </div>
      )}

      {step === "enter-code" && (
        <form className="login-form" onSubmit={onSubmitCode}>
          <p className="login-hint">
            We sent a sign-in code to <strong>{email.trim()}</strong>.
          </p>
          <TextInput
            value={code}
            placeholder="Sign-in code"
            autoComplete="one-time-code"
            inputMode="numeric"
            autoFocus
            onChange={setCode}
            disabled={busy}
          />
          <Button variant="primary" type="submit" disabled={busy || !code.trim()}>
            Sign in
          </Button>
          <div className="login-secondary">
            <Button variant="link" onClick={onResend} disabled={busy}>
              Resend code
            </Button>
            <Button variant="link" onClick={onChangeEmail} disabled={busy}>
              Use a different email
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
