import { NextRequest, NextResponse } from 'next/server';

const staticFileRegex = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || staticFileRegex.test(pathname)) {
    return NextResponse.next();
  }

  const canonicalOrigin = process.env.ORIGIN?.trim();
  if (canonicalOrigin) {
    const canonicalUrl = new URL(canonicalOrigin);
    if (nextUrl.host !== canonicalUrl.host) {
      const redirectUrl = new URL(request.url);
      redirectUrl.protocol = canonicalUrl.protocol;
      redirectUrl.host = canonicalUrl.host;
      return NextResponse.redirect(redirectUrl, 301);
    }
  }

  if (pathname !== '/' && pathname.endsWith('/')) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
