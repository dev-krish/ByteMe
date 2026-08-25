import { NextResponse } from "next/server";
import { computeRFCTLARRCompensation } from "@/lib/rfctlarr-engine";
import { CompensationInput } from "@/types";

export async function POST(request: Request) {
  try {
    const body: CompensationInput = await request.json();

    if (!body.baseMarketRatePerHa || !body.areaHa) {
      return NextResponse.json(
        { success: false, message: "Base rate and area are required" },
        { status: 400 }
      );
    }

    const result = computeRFCTLARRCompensation(body);

    return NextResponse.json({
      success: true,
      calculation: result,
      statutoryReference: "RFCTLARR Act 2013 (First Schedule, Sections 26-30)",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Calculation failure" },
      { status: 500 }
    );
  }
}
