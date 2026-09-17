import type { LicenseRecord } from "@/features/licenses/types";
import { generateLicenses } from "./licenses";
import { validateSeatsAllowed } from "@/features/licenses/utils/license-validation";

/**
 * In-memory only, per server process. There is no database — this exists so the
 * route handlers have something to read/mutate that persists across requests
 * within a single dev/server session, per the "no backend persistence" scope.
 */
const licenses: LicenseRecord[] = generateLicenses();

export class LicenseNotFoundError extends Error {}
export class InvalidSeatsError extends Error {}

export function getAllLicenses(): LicenseRecord[] {
  return licenses;
}

function getLicenseById(id: string): LicenseRecord | undefined {
  return licenses.find((license) => license.id === id);
}

export function updateSeatsAllowed(id: string, seatsAllowed: number): LicenseRecord {
  const license = getLicenseById(id);
  if (!license) {
    throw new LicenseNotFoundError(`License "${id}" was not found.`);
  }

  const error = validateSeatsAllowed(seatsAllowed, license.seatsUsed);
  if (error) {
    throw new InvalidSeatsError(error);
  }

  license.seatsAllowed = seatsAllowed;
  return license;
}
