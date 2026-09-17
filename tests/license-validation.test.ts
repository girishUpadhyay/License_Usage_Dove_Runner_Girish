import { describe, expect, it } from "vitest";
import { validateSeatsAllowed } from "@/features/licenses/utils/license-validation";

describe("validateSeatsAllowed", () => {
  it("rejects NaN", () => {
    expect(validateSeatsAllowed(NaN, 5)).toMatch(/enter a number/i);
  });

  it("rejects non-integers", () => {
    expect(validateSeatsAllowed(10.5, 5)).toMatch(/whole number/i);
  });

  it("rejects negative values", () => {
    expect(validateSeatsAllowed(-1, 0)).toMatch(/cannot be negative/i);
  });

  it("rejects a value below seats used", () => {
    expect(validateSeatsAllowed(4, 5)).toMatch(/cannot be less than seats used/i);
  });

  it("accepts a valid value", () => {
    expect(validateSeatsAllowed(10, 5)).toBeNull();
  });

  it("accepts a value equal to seats used", () => {
    expect(validateSeatsAllowed(5, 5)).toBeNull();
  });

  it("accepts zero when seats used is zero", () => {
    expect(validateSeatsAllowed(0, 0)).toBeNull();
  });
});
