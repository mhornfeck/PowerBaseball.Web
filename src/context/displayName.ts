import type { CurrentUserResponse } from "../api/generated";

/**
 * The name a player goes by in games. The backend may not have a display name
 * for a user, so fall back to the part of their email before the "@".
 */
export function playerDisplayName(
  user: Pick<CurrentUserResponse, "displayName" | "email">,
): string {
  const name = user.displayName?.trim();
  if (name) return name;
  return user.email.split("@")[0];
}
