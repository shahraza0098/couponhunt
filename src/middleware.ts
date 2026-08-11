import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclude the login page itself
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const adminCookie = request.cookies.get('admin_session');

    // If no cookie, redirect to login
    if (!adminCookie || adminCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
