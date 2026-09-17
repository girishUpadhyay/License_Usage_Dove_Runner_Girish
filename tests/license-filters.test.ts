import { describe, expect, it } from "vitest";
import { filterLicenses, paginate, sortLicenses } from "@/features/licenses/utils/license-filters";
import type { LicenseRecord } from "@/features/licenses/types";

function makeLicense(overrides: Partial<LicenseRecord>): LicenseRecord {
  return {
    id: "lic_000",
    customerName: "Acme Industries",
    plan: "Standard",
    status: "Active",
    seatsUsed: 10,
    seatsAllowed: 20,
    renewalDate: "2026-01-01T00:00:00.000Z",
    accountOwnerEmail: "owner@acme.com",
    createdDate: "2025-01-01T00:00:00.000Z",
    notes: "",
    ...overrides,
  };
}

const licenses: LicenseRecord[] = [
  makeLicense({ id: "a", customerName: "Acme Industries", plan: "Enterprise", status: "Active", seatsUsed: 40, seatsAllowed: 100, renewalDate: "2026-03-01T00:00:00.000Z" }),
  makeLicense({ id: "b", customerName: "Globex Solutions", plan: "Trial", status: "Expiring Soon", seatsUsed: 5, seatsAllowed: 5, renewalDate: "2026-01-15T00:00:00.000Z" }),
  makeLicense({ id: "c", customerName: "Initech Labs", plan: "Standard", status: "Expired", seatsUsed: 0, seatsAllowed: 0, renewalDate: "2025-11-01T00:00:00.000Z" }),
];

describe("filterLicenses", () => {
  it("matches customer name case-insensitively", () => {
    const result = filterLicenses(licenses, { search: "acme", status: "All", plan: "All" });
    expect(result.map((l) => l.id)).toEqual(["a"]);
  });

  it("filters by status", () => {
    const result = filterLicenses(licenses, { search: "", status: "Expired", plan: "All" });
    expect(result.map((l) => l.id)).toEqual(["c"]);
  });

  it("filters by plan", () => {
    const result = filterLicenses(licenses, { search: "", status: "All", plan: "Trial" });
    expect(result.map((l) => l.id)).toEqual(["b"]);
  });

  it("combines search, status, and plan filters", () => {
    const result = filterLicenses(licenses, { search: "globex", status: "Expiring Soon", plan: "Trial" });
    expect(result.map((l) => l.id)).toEqual(["b"]);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterLicenses(licenses, { search: "nonexistent", status: "All", plan: "All" });
    expect(result).toEqual([]);
  });
});

describe("sortLicenses", () => {
  it("sorts by customer name ascending and descending", () => {
    const asc = sortLicenses(licenses, "customerName", "asc").map((l) => l.id);
    expect(asc).toEqual(["a", "b", "c"]);

    const desc = sortLicenses(licenses, "customerName", "desc").map((l) => l.id);
    expect(desc).toEqual(["c", "b", "a"]);
  });

  it("sorts by seats usage ratio without dividing by zero", () => {
    // a: 0.4, b: 1.0, c: 0/0 -> treated as 0
    const asc = sortLicenses(licenses, "seats", "asc").map((l) => l.id);
    expect(asc).toEqual(["c", "a", "b"]);
  });

  it("sorts by renewal date", () => {
    const asc = sortLicenses(licenses, "renewalDate", "asc").map((l) => l.id);
    expect(asc).toEqual(["c", "b", "a"]);
  });

  it("does not mutate the input array", () => {
    const copy = [...licenses];
    sortLicenses(licenses, "customerName", "desc");
    expect(licenses).toEqual(copy);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => i);

  it("slices the requested page", () => {
    expect(paginate(items, 1, 10)).toEqual(items.slice(0, 10));
    expect(paginate(items, 2, 10)).toEqual(items.slice(10, 20));
    expect(paginate(items, 3, 10)).toEqual(items.slice(20, 25));
  });

  it("returns an empty array for an out-of-range page", () => {
    expect(paginate(items, 10, 10)).toEqual([]);
  });
});
