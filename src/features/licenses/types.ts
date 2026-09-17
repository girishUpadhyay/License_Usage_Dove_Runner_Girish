export type LicensePlan = "Trial" | "Standard" | "Enterprise";

export type LicenseStatus = "Active" | "Expiring Soon" | "Expired" | "Suspended";

export const LICENSE_PLANS: LicensePlan[] = ["Trial", "Standard", "Enterprise"];

export const LICENSE_STATUSES: LicenseStatus[] = [
  "Active",
  "Expiring Soon",
  "Expired",
  "Suspended",
];

export interface LicenseRecord {
  id: string;
  customerName: string;
  plan: LicensePlan;
  status: LicenseStatus;
  seatsUsed: number;
  seatsAllowed: number;
  /** ISO 8601 date string */
  renewalDate: string;
  accountOwnerEmail: string;
  /** ISO 8601 date string */
  createdDate: string;
  notes: string;
}

export interface LicensesApiResponse {
  data: LicenseRecord[];
}

export interface LicenseApiResponse {
  data: LicenseRecord;
}

export interface ApiErrorResponse {
  error: string;
}

interface UpdateSeatsRequestBody {
  seatsAllowed: number;
}

export function isUpdateSeatsRequestBody(value: unknown): value is UpdateSeatsRequestBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "seatsAllowed" in value &&
    typeof (value as Record<string, unknown>).seatsAllowed === "number"
  );
}
