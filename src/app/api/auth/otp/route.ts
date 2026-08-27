import { NextResponse } from "next/server";

// In-memory OTP store for hackathon simulation (keyed by phone or Aadhaar identifier)
const OTP_STORE = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, identifier } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: "Aadhaar number or Mobile number is required" },
        { status: 400 }
      );
    }

    const cleanId = String(identifier).replace(/[\s-]/g, "").toLowerCase();
    const isEmail = identifier.includes("@") || body.channel === "email";

    if (action === "send") {
      // Generate standard 6-digit OTP (Default demo OTP is 123456 or a valid 6-digit random code)
      const otp = "123456";
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
      OTP_STORE.set(cleanId, { otp, expiresAt });

      let message = "OTP dispatched to UIDAI/Aadhaar-linked mobile number ending in ••••" + cleanId.slice(-4);
      if (isEmail) {
        const [u, d] = identifier.split("@");
        const masked = u.length > 2 ? `${u[0]}•••${u.slice(-1)}@${d}` : `${u}@${d}`;
        message = `Verification code dispatched to registered email ${masked}`;
      }

      return NextResponse.json({
        success: true,
        channel: isEmail ? "email" : "aadhaar",
        message,
        demoOtp: "123456",
        expiresInSeconds: 300,
      });
    }

    if (action === "verify") {
      const { otp } = body;
      const stored = OTP_STORE.get(cleanId);

      // Support 123456 as master demo OTP or exact match
      const isValid = otp === "123456" || (stored && stored.otp === otp && Date.now() <= stored.expiresAt);

      if (!isValid) {
        return NextResponse.json(
          { error: `Invalid or expired ${isEmail ? "Email verification code" : "Aadhaar OTP"}. Please use demo OTP: 123456.` },
          { status: 400 }
        );
      }

      // Cleanup
      OTP_STORE.delete(cleanId);

      return NextResponse.json({
        success: true,
        channel: isEmail ? "email" : "aadhaar",
        message: isEmail ? "Official email verification successful." : "UIDAI Aadhaar biometric / OTP verification successful.",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("OTP service error:", error);
    return NextResponse.json(
      { error: "Failed to process OTP verification" },
      { status: 500 }
    );
  }
}
