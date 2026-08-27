import { NextResponse } from "next/server";
import { signSession, UserSession } from "@/lib/security/token";
import { appendAuditRecord } from "@/lib/security/audit";
import { REGISTERED_USERS_STORE } from "@/lib/auth-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = "CITIZEN", phone, agency } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required for registration." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    if (REGISTERED_USERS_STORE.has(cleanEmail)) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please Sign In." },
        { status: 409 }
      );
    }

    const isCitizen = role === "CITIZEN";
    const userRole = isCitizen ? "CITIZEN" : role;
    const department = agency || (isCitizen ? "Landowner" : "Revenue & Land Reforms Department");
    const state = "Rajasthan";

    // Save to in-memory store
    REGISTERED_USERS_STORE.set(cleanEmail, {
      name: name.trim(),
      email: cleanEmail,
      passwordHash: password, // For simulation
      role: userRole,
      phone: phone || "9829012345",
      agency: department,
      department,
      state,
      khasraNo: isCitizen ? "Plot 42A" : undefined,
      village: isCitizen ? "Ramgarh Revenue Ward 3" : undefined,
      district: isCitizen ? "Dausa" : undefined,
    });

    const exp = Date.now() + 8 * 60 * 60 * 1000;
    const userId = `USER-${Date.now().toString().slice(-6)}`;

    const sessionPayload: UserSession = {
      userId,
      name: name.trim(),
      email: cleanEmail,
      role: userRole,
      userType: isCitizen ? "CITIZEN" : "OFFICER",
      department,
      state,
      phone: phone || "9829012345",
      khasraNo: isCitizen ? "Plot 42A" : undefined,
      village: isCitizen ? "Ramgarh Revenue Ward 3" : undefined,
      district: isCitizen ? "Dausa" : undefined,
      aadhaarLast4: isCitizen ? "4291" : undefined,
      exp,
    };

    const token = await signSession(sessionPayload);

    // Append to audit trail
    await appendAuditRecord(
      "USER_REGISTRATION",
      isCitizen ? "CITIZEN-PORTAL" : "EXECUTIVE-PORTAL",
      userId,
      {
        name: name.trim(),
        email: cleanEmail,
        role: userRole,
        registeredAt: new Date().toISOString(),
      }
    );

    const response = NextResponse.json({
      success: true,
      message: "Account registered successfully.",
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        role: userRole,
        userType: isCitizen ? "CITIZEN" : "OFFICER",
        targetPortal: isCitizen ? "/citizen-portal" : "/executive-dashboard",
      },
    });

    // Set secure cookie
    response.cookies.set("nlams_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
