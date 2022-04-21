import type { FC, HTMLAttributes, PropsWithChildren } from 'react';
import type { IsomorphicLinkProps } from 'react-router-isomorphic-link';
import { IsomorphicLink } from 'react-router-isomorphic-link';
import { getAriaClasses, getNavLinkClasses, getFocusClasses } from '~/utilities';

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
  outline?: 'normal' | 'small' | 'none';
} & IsomorphicLinkProps;

type LinkProps = {
  nav?: boolean;
} & UnstyledLinkProps;

const UnstyledLink: FC<PropsWithChildren<UnstyledLinkProps>> = ({
  to,
  outline = 'small',
  children,
  className = '',
  ...props
}) => {
  return (
    <IsomorphicLink
      {...props}
      to={addFinalSlash(to)}
      className={({ isActive }) =>
        `${getNavLinkClasses(className, isActive)} ${outline === 'none' ? '' : getAriaClasses(outline === 'small')}`
      }
      prefetch="intent"
      end
    >
      {children}
    </IsomorphicLink>
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
        `${getFocusClasses(true)} underline decoration-primary hover:decoration-secondary focus:decoration-secondary ${
          nav
            ? 'text-xl xl:text-2xl 2xl:text-4xl decoration-8 underline-offset-4 hover:underline-offset-2 active:underline-offset-0'
            : 'decoration-4 underline-offset-2 hover:underline-offset-1 active:underline-offset-0'
        } font-bold ${isActive ? 'pointer-events-none decoration-darkPrimary' : ''} ${getNavLinkClasses(
          className,
          isActive,
        )}`
      }
    >
      {children}
    </UnstyledLink>
  );
};

export type { LinkProps };

export { UnstyledLink, StyledLink };
