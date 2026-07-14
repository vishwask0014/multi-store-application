import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/shop",
  "/shop/",
];

const publicPrefixes = [
  "/_next",
  "/api",
  "/favicon",
  "/images",
  "/fonts",
];

const customerRoutes = [
  "/cart",
  "/checkout",
  "/orders",
  "/bookings",
  "/wishlist",
  "/profile",
];

const ownerPrefixes = [
  "/dashboard",
];

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) return true;
  if (publicPrefixes.some((p) => pathname.startsWith(p))) return true;
  return false;
}

function isOwnerRoute(pathname: string): boolean {
  return ownerPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isCustomerRoute(pathname: string): boolean {
  return customerRoutes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get("__session")?.value;
  const uidCookie = req.cookies.get("uid")?.value;

  const isAuthenticated = !!(sessionCookie && uidCookie);

  if (!isAuthenticated) {
    if (isCustomerRoute(pathname) || isOwnerRoute(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  if (isCustomerRoute(pathname)) {
    return NextResponse.next();
  }

  if (isOwnerRoute(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
