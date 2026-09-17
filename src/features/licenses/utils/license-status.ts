import type { LicenseStatus } from "@/features/licenses/types";
import type { SemanticTone } from "@/theme/muiTheme";

const URGENT_RENEWAL_STATUSES: ReadonlySet<LicenseStatus> = new Set(["Expiring Soon", "Expired"]);

/** True when the renewal date is close enough (or already past) to be worth calling out inline. */
export function isRenewalUrgent(status: LicenseStatus): boolean {
  return URGENT_RENEWAL_STATUSES.has(status);
}

/** What a status means, color-wise — the single place that decision is made. */
export const LICENSE_STATUS_TONE: Record<LicenseStatus, SemanticTone> = {
  Active: "positive",
  "Expiring Soon": "caution",
  Expired: "danger",
  Suspended: "neutral",
};
