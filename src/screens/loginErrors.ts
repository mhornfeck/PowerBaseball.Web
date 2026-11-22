import { ApiError } from "../api/generated";

// Turns a failed sign-in request into a message for the login screen.

const GENERIC = "Something went wrong. Please try again.";
const TOO_MANY = "Too many attempts. Wait a moment and try again.";

export function sendCodeErrorMessage(err: unknown): string {
  if (!(err instanceof ApiError)) return GENERIC;
  if (err.status === 400) return "Enter a valid email address.";
  if (err.status === 429) return TOO_MANY;
  return GENERIC;
}

export function verifyCodeErrorMessage(err: unknown): string {
  if (!(err instanceof ApiError)) return GENERIC;
  if (err.status === 400 || err.status === 401) {
    return "That code is wrong or has expired.";
  }
  if (err.status === 429) return TOO_MANY;
  return GENERIC;
}
