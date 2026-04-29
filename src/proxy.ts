import { NextRequest, NextResponse } from 'next/server';

// Proxy is the new convention in Next.js 16 (replacing middleware)
// This file handles basic redirects and network boundary logic.

export function proxy(request: NextRequest) {
  // Allow all requests through - auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
