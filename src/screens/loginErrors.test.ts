import { describe, expect, it } from "vitest";
import { ApiError } from "../api/generated";
import { sendCodeErrorMessage, verifyCodeErrorMessage } from "./loginErrors";

function apiError(status: number) {
  return new ApiError(
    { method: "POST", url: "/auth/test" },
    { url: "/auth/test", ok: false, status, statusText: "", body: undefined },
    "failed",
  );
}

describe("sendCodeErrorMessage", () => {
  it("asks for a valid email on 400", () => {
    expect(sendCodeErrorMessage(apiError(400))).toBe(
      "Enter a valid email address.",
    );
  });

  it("asks the user to wait on 429", () => {
    expect(sendCodeErrorMessage(apiError(429))).toMatch(/Too many attempts/);
  });

  it("falls back to a generic message for other failures", () => {
    expect(sendCodeErrorMessage(apiError(500))).toMatch(/went wrong/);
    expect(sendCodeErrorMessage(new TypeError("Failed to fetch"))).toMatch(
      /went wrong/,
    );
  });
});

describe("verifyCodeErrorMessage", () => {
  it("reports a wrong or expired code on 400 and 401", () => {
    expect(verifyCodeErrorMessage(apiError(400))).toMatch(/wrong or has expired/);
    expect(verifyCodeErrorMessage(apiError(401))).toMatch(/wrong or has expired/);
  });

  it("asks the user to wait on 429", () => {
    expect(verifyCodeErrorMessage(apiError(429))).toMatch(/Too many attempts/);
  });

  it("falls back to a generic message for other failures", () => {
    expect(verifyCodeErrorMessage(apiError(503))).toMatch(/went wrong/);
  });
});
