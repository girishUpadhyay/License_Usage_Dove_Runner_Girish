import type {
  ApiErrorResponse,
  LicenseApiResponse,
  LicenseRecord,
  LicensesApiResponse,
} from "@/features/licenses/types";

async function parseJsonResponse<T>(res: Response, fallbackErrorMessage: string): Promise<T> {
  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error((body as ApiErrorResponse | null)?.error ?? fallbackErrorMessage);
  }

  return body as T;
}

export async function fetchLicenses(simulateError: boolean): Promise<LicenseRecord[]> {
  const query = simulateError ? "?simulateError=1" : "";
  const res = await fetch(`/api/licenses${query}`);
  const { data } = await parseJsonResponse<LicensesApiResponse>(res, "Failed to load licenses.");
  return data;
}

export async function patchSeatsAllowed(
  id: string,
  seatsAllowed: number
): Promise<LicenseRecord> {
  const res = await fetch(`/api/licenses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seatsAllowed }),
  });
  const { data } = await parseJsonResponse<LicenseApiResponse>(res, "Failed to update seats allowed.");
  return data;
}
