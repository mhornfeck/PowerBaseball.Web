import { describe, expect, it } from "vitest";
import { googleLoginUrl, takeAuthError } from "./authUrl";

describe("googleLoginUrl", () => {
  it("encodes the return path", () => {
    expect(googleLoginUrl("https://api.test", "/game/a b?x=1")).toBe(
      "https://api.test/auth/google/login?returnUrl=%2Fgame%2Fa+b%3Fx%3D1",
    );
  });

  it("supports a same-origin (empty) base", () => {
    expect(googleLoginUrl("", "/")).toBe("/auth/google/login?returnUrl=%2F");
  });
});

describe("takeAuthError", () => {
  it("returns nothing when there is no authError", () => {
    expect(takeAuthError(new URL("https://app.test/?x=1"))).toEqual({
      error: null,
      cleanedUrl: null,
    });
  });

  it("extracts the error and strips only that parameter", () => {
    expect(
      takeAuthError(new URL("https://app.test/play?x=1&authError=denied#top")),
    ).toEqual({ error: "denied", cleanedUrl: "/play?x=1#top" });
  });

  it("leaves no dangling ? when authError was the only parameter", () => {
    expect(takeAuthError(new URL("https://app.test/?authError=denied"))).toEqual(
      { error: "denied", cleanedUrl: "/" },
    );
  });
});
