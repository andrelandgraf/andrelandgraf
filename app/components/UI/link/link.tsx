import type { FC, PropsWithChildren } from 'react';
import type { NavLinkProps } from 'remix';
import { NavLink } from 'remix';

/**
 * Why do we to add final slashes?
 * Netlify will redirect all pages that do not end with a slash to a page that ends with a slash
 *
 * Background:
 * All pages in Gatsby are beautified (by Netlify) e.g. /index.html will be / in the url bar
 * Because of that /contact and /contact/ are the same page / same content
 * Netlify will redirect /contact to /contact/ via 301 (permanent redirect)
 * This hurts seo!
 * Having both /contact and /contact/ also hurts seo because of duplicate content!
 *
 * So solution:
 * In our code, always use ending /
 * In our sitemap and robots files always end with /
 * Let Netlify redirect /contact to /contact/ if the user types it in the url bar
 *
 * This way we won't have any redirects in our sitemap
 */
export function addFinalSlash(link: string): string {
  if (!link) {
    return '/';
  }
  if (link[link.length - 1] === '/') {
    return link;
  }

  const hasQuery = link.includes('?');
  if (!hasQuery) {
    return link + '/';
  }

  const splits = link.split('?');
  const path = addFinalSlash(splits.splice(0, 1)[0]);
  return path + '?' + splits[0];
}

const getNavLinkClasses = (className: NavLinkProps['className'], isActive: boolean): string => {
  if (!className) {
    return '';
  }
  if (typeof className === 'string') {
    return className;
  }
  return className({ isActive });
};

type LinkProps = {
  to: string;
  external?: boolean;
  nav?: boolean;
} & NavLinkProps;

const StyledLink: FC<PropsWithChildren<LinkProps>> = ({
  to,
  external = false,
  nav = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <>
      {external ? (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            nav ? 'text-xl xl:text-2xl 2xl:text-4xl' : ''
          } font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 focus:outline-none focus:ring-4 dark:focus:ring-blue-500 focus:ring-blue-700 ${getNavLinkClasses(
            className,
            false,
          )}`}
        >
          {children}
        </a>
      ) : (
        <NavLink
          to={addFinalSlash(to)}
          className={({ isActive }) =>
            `${
              nav ? 'text-xl xl:text-2xl 2xl:text-4xl' : ''
            } font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 focus:outline-none focus:ring-4 dark:focus:ring-blue-500 focus:ring-blue-700 ${
              isActive ? 'underline pointer-events-none' : ''
            } ${getNavLinkClasses(className, isActive)}`
          }
          {...props}
          prefetch="intent"
          end
        >
          {children}
        </NavLink>
      )}
    </>
  );
};

export default StyledLink;
