import type { LicensePlan, LicenseRecord, LicenseStatus } from "@/features/licenses/types";

export type SortKey = "customerName" | "plan" | "status" | "seats" | "renewalDate";
export type SortDirection = "asc" | "desc";

interface LicenseFiltersState {
  search: string;
  status: LicenseStatus | "All";
  plan: LicensePlan | "All";
}

export const DEFAULT_FILTERS: LicenseFiltersState = {
  search: "",
  status: "All",
  plan: "All",
};

export function filterLicenses(
  licenses: LicenseRecord[],
  filters: LicenseFiltersState
): LicenseRecord[] {
  const search = filters.search.trim().toLowerCase();

  return licenses.filter((license) => {
    if (search && !license.customerName.toLowerCase().includes(search)) {
      return false;
    }
    if (filters.status !== "All" && license.status !== filters.status) {
      return false;
    }
    if (filters.plan !== "All" && license.plan !== filters.plan) {
      return false;
    }
    return true;
  });
}

function seatsRatio(license: LicenseRecord): number {
  return license.seatsAllowed === 0 ? 0 : license.seatsUsed / license.seatsAllowed;
}

export function sortLicenses(
  licenses: LicenseRecord[],
  sortKey: SortKey,
  direction: SortDirection
): LicenseRecord[] {
  const sorted = [...licenses].sort((a, b) => {
    let result: number;
    switch (sortKey) {
      case "customerName":
        result = a.customerName.localeCompare(b.customerName);
        break;
      case "plan":
        result = a.plan.localeCompare(b.plan);
        break;
      case "status":
        result = a.status.localeCompare(b.status);
        break;
      case "seats":
        result = seatsRatio(a) - seatsRatio(b);
        break;
      case "renewalDate":
        result = a.renewalDate.localeCompare(b.renewalDate);
        break;
    }
    return direction === "asc" ? result : -result;
  });

  return sorted;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
