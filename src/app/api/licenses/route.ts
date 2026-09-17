import { NextResponse } from "next/server";
import { getAllLicenses } from "@/features/licenses/data/licenses-store";
import { delay } from "@/utils/delay";
import type { ApiErrorResponse, LicensesApiResponse } from "@/features/licenses/types";

// Not cached — the store can be mutated via PATCH, so every GET should read
// current in-memory state.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Lets the UI demonstrate its error state on demand without a flaky
  // real dependency.
  if (searchParams.get("simulateError") === "1") {
    await delay(300);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Simulated server error." },
      { status: 500 }
    );
  }

  await delay(400);
  return NextResponse.json<LicensesApiResponse>({ data: getAllLicenses() });
}
