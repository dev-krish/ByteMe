import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Officer session securely terminated",
  });

  // Clear cookie
  response.cookies.set("nlams_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
