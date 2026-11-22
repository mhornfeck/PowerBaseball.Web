import { describe, expect, it } from "vitest";
import { playerDisplayName } from "./displayName";

describe("playerDisplayName", () => {
  it("uses the display name when there is one", () => {
    expect(
      playerDisplayName({ displayName: "Slugger", email: "pat@example.com" }),
    ).toBe("Slugger");
  });

  it("trims the display name", () => {
    expect(
      playerDisplayName({ displayName: "  Slugger ", email: "pat@example.com" }),
    ).toBe("Slugger");
  });

  it("falls back to the email name when the display name is missing or blank", () => {
    expect(playerDisplayName({ email: "pat@example.com" })).toBe("pat");
    expect(playerDisplayName({ displayName: null, email: "pat@example.com" })).toBe(
      "pat",
    );
    expect(playerDisplayName({ displayName: "  ", email: "pat@example.com" })).toBe(
      "pat",
    );
  });
});
