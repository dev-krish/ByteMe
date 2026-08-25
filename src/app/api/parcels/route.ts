import { NextResponse } from "next/server";
import { MOCK_PARCELS } from "@/lib/data/cadastral-parcels";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();
  const village = searchParams.get("village");
  const status = searchParams.get("status");

  let filtered = MOCK_PARCELS;

  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.khasraNo.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q)
    );
  }

  if (village) {
    filtered = filtered.filter((p) => p.village === village);
  }

  if (status) {
    filtered = filtered.filter((p) => p.surveyStatus === status);
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}
