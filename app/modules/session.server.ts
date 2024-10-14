import { redirect } from '@remix-run/node';
import { env } from './env.server.ts';

export function requireCanonicalSession(request: Request) {
  const url = new URL(request.url);

  const canonicalOrigin = new URL(env.server.origin);
  if (url.hostname !== canonicalOrigin.hostname) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.hostname = canonicalOrigin.hostname;
    if (canonicalUrl.pathname !== '/' && canonicalUrl.pathname.endsWith('/')) {
      canonicalUrl.pathname = canonicalUrl.pathname.slice(0, -1);
    }
    throw redirect(canonicalUrl.toString(), { status: 301, statusText: 'Moved Permanently' });
  }

  const pathname = url.pathname;
  if (pathname !== '/' && pathname.endsWith('/')) {
    throw redirect(pathname.slice(0, -1), { status: 301, statusText: 'Moved Permanently' });
  }
}
