import { NextResponse } from "next/server";
import { signSession, OfficerSession } from "@/lib/security/token";
import { appendAuditRecord } from "@/lib/security/audit";

// Verified Officer Accounts Directory
const VERIFIED_OFFICERS: Record<
  string,
  {
    pass: string;
    officer: Omit<OfficerSession, "exp">;
  }
> = {
  "cala.dausa@gov.in": {
    pass: "cala@2026",
    officer: {
      userId: "OFFICER-DAUSA-01",
      name: "Rajeshwar Sharma, IAS",
      email: "cala.dausa@gov.in",
      role: "CALA_OFFICER",
      department: "Revenue & Land Reforms Department",
      state: "Rajasthan",
    },
  },
  "dg.nhai@gov.in": {
    pass: "nhai@2026",
    officer: {
      userId: "OFFICER-NHAI-HQ",
      name: "Dr. Vikramaditya Sen",
      email: "dg.nhai@gov.in",
      role: "DIRECTOR_GENERAL",
      department: "National Highways Authority of India",
      state: "National HQ (New Delhi)",
    },
  },
  "officer@nic.in": {
    pass: "demo@2026",
    officer: {
      userId: "OFFICER-NIC-DEMO",
      name: "Ananya Deshmukh, IAS",
      email: "officer@nic.in",
      role: "CALA_OFFICER",
      department: "Department of Land Resources (DoLR)",
      state: "Maharashtra",
    },
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required credentials" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const match = VERIFIED_OFFICERS[cleanEmail];

    if (!match || match.pass !== password) {
      return NextResponse.json(
        { error: "Invalid officer credentials or unverified Gov SSO email." },
        { status: 401 }
      );
    }

    // 8-hour session expiry
    const exp = Date.now() + 8 * 60 * 60 * 1000;
    const sessionPayload: OfficerSession = {
      ...match.officer,
      exp,
    };

    const token = await signSession(sessionPayload);

    // Record login in immutable audit ledger
    await appendAuditRecord(
      "OFFICER_LOGIN",
      "AUTH-PORTAL",
      sessionPayload.userId,
      {
        email: cleanEmail,
        role: sessionPayload.role,
        department: sessionPayload.department,
      }
    );

    const response = NextResponse.json({
      success: true,
      message: "Officer session authenticated via HMAC-SHA256 token",
      officer: {
        name: sessionPayload.name,
        email: sessionPayload.email,
        role: sessionPayload.role,
        department: sessionPayload.department,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set("nlams_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours in seconds
    });

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal security authorization failure" },
      { status: 500 }
    );
  }
}
