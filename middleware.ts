import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token');
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = ['/admin/dashboard', '/admin/blogs'];
  
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath && !adminToken) {
    // If trying to access protected paths without a token, redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (pathname === '/admin/login' && adminToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
