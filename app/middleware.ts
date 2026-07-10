import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const requestHeaders = new Headers(request.headers);
    const xForwardedProto = requestHeaders.get('x-forwarded-proto');

    if (xForwardedProto === 'http') {
      const host = request.headers.get('host') ?? request.nextUrl.host;
      const newUrl = new URL(request.nextUrl.pathname, `https://${host}`);
      return NextResponse.redirect(newUrl.toString(), 301); // 301 for permanent redirect
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
