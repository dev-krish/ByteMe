import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "./lib/security/token";

// Public routes that do not require authentication
const PUBLIC_ROUTES = ["/login", "/api/auth", "/unauthorized"];

// Officer-only administrative modules
const OFFICER_ONLY_ROUTES = ["/acquisitions/new", "/operations", "/executive-dashboard"];

// Gated routes requiring authentication
const GATED_ROUTES = [
  "/executive-dashboard",
  "/workflow",
  "/gis-map",
  "/compensation",
  "/operations",
  "/acquisitions/new",
  "/thank-you",
  "/citizen-portal",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow root landing page and public auth endpoints
  const isPublic = pathname === "/" || PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // Determine if current route is gated
  const isGated = GATED_ROUTES.some((route) => pathname.startsWith(route));

  const sessionCookie = request.cookies.get("nlams_session")?.value;
  let session = null;

  if (sessionCookie) {
    session = await verifySession(sessionCookie);
  }

  // 1. If user tries to access a gated route without a valid session -> redirect to /login
  if (isGated && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("reason", "auth_required");
    return NextResponse.redirect(loginUrl);
  }

  // 2. If a citizen tries to access officer-only administrative routes -> restrict and show explanation page
  if (session && session.role === "CITIZEN" && OFFICER_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("attemptedPath", pathname);
    unauthorizedUrl.searchParams.set("reason", "officer_clearance_required");
    return NextResponse.redirect(unauthorizedUrl);
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
