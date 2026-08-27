import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "./lib/security/token";

// Routes that strictly require officer authentication
const PROTECTED_ROUTES = [
  "/executive-dashboard",
  "/workflow",
  "/acquisitions/new",
  "/operations",
  "/compensation",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current route is protected
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const sessionCookie = request.cookies.get("nlams_session")?.value;
  let session = null;

  if (sessionCookie) {
    session = await verifySession(sessionCookie);
  }

  // If user tries to access protected page without valid session, redirect to login
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("reason", "auth_required");
    return NextResponse.redirect(loginUrl);
  }

  // Create response and attach OWASP Security Headers
  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled individually)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images & public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
