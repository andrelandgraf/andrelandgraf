import type { FC, PropsWithChildren } from 'react';
import type { NavLinkProps } from 'remix';
import { NavLink } from 'remix';
import { getAriaClasses, getNavLinkClasses } from '~/utilities';

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

type UnstyledLinkProps = {
  to: string;
  external?: boolean;
  outline?: 'normal' | 'small' | 'none';
} & NavLinkProps;

type LinkProps = {
  nav?: boolean;
} & UnstyledLinkProps;

const UnstyledLink: FC<PropsWithChildren<UnstyledLinkProps>> = ({
  to,
  external = false,
  outline = 'small',
  children,
  className = '',
  ...props
}) => {
  return (
    <>
      {external ? (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={`${getNavLinkClasses(className, false)} ${
            outline === 'none' ? '' : getAriaClasses(outline === 'small')
          }`}
        >
          {children}
        </a>
      ) : (
        <NavLink
          {...props}
          to={addFinalSlash(to)}
          className={({ isActive }) =>
            `${getNavLinkClasses(className, isActive)} ${outline === 'none' ? '' : getAriaClasses(outline === 'small')}`
          }
          prefetch="intent"
          end
        >
          {children}
        </NavLink>
      )}
    </>
  );
};

const StyledLink: FC<PropsWithChildren<LinkProps>> = ({
  to,
  external = false,
  nav = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <UnstyledLink
      {...props}
      to={to}
      external={external}
      outline="none"
      className={({ isActive }) =>
        `underline decoration-primary ${
          nav
            ? 'underline text-xl xl:text-2xl 2xl:text-4xl decoration-4 underline-offset-4'
            : 'decoration-2 underline-offset-2'
        } font-bold ${isActive ? 'underline pointer-events-none' : ''} ${getNavLinkClasses(className, isActive)}`
      }
    >
      {children}
    </UnstyledLink>
  );
};

export type { LinkProps };

export { UnstyledLink, StyledLink };
