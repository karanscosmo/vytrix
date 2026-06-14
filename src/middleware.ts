import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRateLimited } from "@/lib/security/rate-limit";

// Match all system routes and API paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/copilot/:path*",
    "/digital-twin/:path*",
    "/infrastructure/:path*",
    "/alerts/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/api/:path*"
  ]
};

export function middleware(request: NextRequest) {
  const ip = request.ip || "127.0.0.1";
  const pathname = request.nextUrl.pathname;

  // 1. Rate Limiting Scaffold
  // Apply a mock rate limit (e.g., max 100 requests per minute per IP for api paths, 300 for pages)
  const limitConfig = pathname.startsWith("/api")
    ? { limit: 100, windowMs: 60000 }
    : { limit: 300, windowMs: 60000 };

  const rateResult = isRateLimited(ip, limitConfig);

  if (rateResult.limited) {
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "API rate limit exceeded. Request throttled.",
        retryAfter: Math.round((rateResult.resetTime - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.round((rateResult.resetTime - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": limitConfig.limit.toString(),
          "X-RateLimit-Remaining": "0"
        }
      }
    );
  }

  // 2. Authentication Route Protection Scaffold
  // Log check or examine session cookie (e.g. 'vytrix_session')
  const session = request.cookies.get("vytrix_session");
  
  // Note: For presentation/demo purposes, we allow the request through.
  // In a production system, we would redirect: return NextResponse.redirect(new URL('/login', request.url))
  // We append a custom request header to show auth validation succeeded.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-vytrix-authenticated", session ? "true" : "mock-authorized");
  requestHeaders.set("X-RateLimit-Limit", limitConfig.limit.toString());
  requestHeaders.set("X-RateLimit-Remaining", rateResult.remaining.toString());

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}
