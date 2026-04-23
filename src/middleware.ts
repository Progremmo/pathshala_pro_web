import { NextRequest, NextResponse } from 'next/server';

// Middleware is kept minimal - auth protection is handled client-side
// via Zustand (localStorage) in the dashboard layout component.
// This middleware only handles basic redirects.

export function middleware(request: NextRequest) {
  // Allow all requests through - auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
