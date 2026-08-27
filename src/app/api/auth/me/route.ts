import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/security/token";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nlams_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
        userType: session.userType || (session.role === "CITIZEN" ? "CITIZEN" : "OFFICER"),
        department: session.department,
        state: session.state,
        district: session.district,
        village: session.village,
        khasraNo: session.khasraNo,
        aadhaarLast4: session.aadhaarLast4,
        phone: session.phone,
      },
      // Backward compatibility
      officer: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
        department: session.department,
        state: session.state,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
