import type { LinkProps } from 'remix';

function removeHostFromTo(link: LinkProps['to'], host: string): LinkProps['to'] {
  if (typeof link === 'string') {
    const href = link.replace(host, '');
    return href || '/';
  }
  const { pathname, search, hash } = link;
  if (!pathname || !pathname.startsWith(host)) {
    return link;
  }
  const href = pathname.replace(host, '');
  return {
    pathname: href || '/',
    search,
    hash,
  };
}

function toToUrlStr(link: LinkProps['to'], host: string, currentPath: string): string {
  if (typeof link === 'string') {
    return link;
  }
  const pathname = !link.pathname || link.pathname === '.' ? currentPath : link.pathname;
  const search = link.search ? (link.search.startsWith('?') ? link.search : `?${link.search}`) : '';
  const hash = link.hash ? (link.hash.startsWith('#') ? link.hash : `#${link.hash}`) : '';
  return `${host}${pathname}${hash}${search}`;
}

// for origin, use window.location.origin in browser and process.env.host on server
function hrefIsOutgoing(href: string, origin: string) {
  // http includes both https and http
  return href.startsWith('http') && !href.startsWith(origin);
}

// returns true if a link is external or outgoing from the current domain
function isExternalLink(link: string, origin: string): boolean {
  return hrefIsOutgoing(link, origin) || link.startsWith('mailto') || link.startsWith('tel');
}

export { isExternalLink, removeHostFromTo, toToUrlStr };
