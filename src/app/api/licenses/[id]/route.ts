import { NextResponse } from "next/server";
import {
  InvalidSeatsError,
  LicenseNotFoundError,
  updateSeatsAllowed,
} from "@/features/licenses/data/licenses-store";
import { delay } from "@/utils/delay";
import {
  isUpdateSeatsRequestBody,
  type ApiErrorResponse,
  type LicenseApiResponse,
} from "@/features/licenses/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: unknown = await request.json().catch(() => null);

  if (!isUpdateSeatsRequestBody(body)) {
    return NextResponse.json<ApiErrorResponse>(
      { error: "seatsAllowed must be a number." },
      { status: 400 }
    );
  }

  try {
    await delay(300);
    const updated = updateSeatsAllowed(id, body.seatsAllowed);
    return NextResponse.json<LicenseApiResponse>({ data: updated });
  } catch (error) {
    if (error instanceof LicenseNotFoundError) {
      return NextResponse.json<ApiErrorResponse>({ error: error.message }, { status: 404 });
    }
    if (error instanceof InvalidSeatsError) {
      return NextResponse.json<ApiErrorResponse>({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
