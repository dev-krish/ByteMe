import { NextResponse } from "next/server";
import { computeRFCTLARRCompensation } from "@/lib/rfctlarr-engine";
import { CompensationInput } from "@/types";

export async function POST(request: Request) {
  try {
    const body: CompensationInput = await request.json();

    // Strict input validation & sanitization
    if (
      typeof body.baseMarketRatePerHa === "number" &&
      (isNaN(body.baseMarketRatePerHa) ||
        body.baseMarketRatePerHa <= 0 ||
        body.baseMarketRatePerHa > 1000000000) // Max 100 Cr/Ha sanity check
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid base market rate value. Must be a positive numeric value." },
        { status: 400 }
      );
    }

    if (
      typeof body.areaHa !== "number" ||
      isNaN(body.areaHa) ||
      body.areaHa <= 0 ||
      body.areaHa > 100000 // Max 100,000 Ha sanity check
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid area value. Must be a positive numeric value in Hectares." },
        { status: 400 }
      );
    }

    if (typeof body.distanceFromUrbanKm === "number" && (body.distanceFromUrbanKm < 0 || body.distanceFromUrbanKm > 2000)) {
      return NextResponse.json(
        { success: false, message: "Invalid distance parameter." },
        { status: 400 }
      );
    }

    const result = computeRFCTLARRCompensation(body);

    return NextResponse.json({
      success: true,
      calculation: result,
      statutoryReference: "RFCTLARR Act 2013 (First Schedule, Sections 26-30)",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Statutory calculation failure due to malformed payload." },
      { status: 500 }
    );
  }
}
