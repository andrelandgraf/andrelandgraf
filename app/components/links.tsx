import type { NavLinkProps as RemixNavLinkProps } from '@remix-run/react';
import { NavLink } from '@remix-run/react';
import clsx from 'clsx';
import type { AnchorHTMLAttributes } from 'react';

import { getAriaClasses, getFocusClasses } from '~/utilities/ariaClasses';

type UnstyledLinkProps = {
  outline?: 'normal' | 'small' | 'none';
} & RemixNavLinkProps;

export type LinkProps = {
  nav?: boolean;
  className?: string;
} & Omit<UnstyledLinkProps, 'className'>;

export function UnstyledLink({ to, outline = 'small', children, className = '', ...props }: UnstyledLinkProps) {
  return (
    <NavLink
      {...props}
      to={to}
      className={(params) =>
        clsx(
          outline === 'none' ? undefined : getAriaClasses(outline === 'small'),
          typeof className === 'function' ? className(params) : className,
        )
      }
      prefetch="intent"
      end
    >
      {children}
    </NavLink>
  );
}

export function StyledLink({ to, nav = false, className = '', children, ...props }: LinkProps) {
  return (
    <UnstyledLink
      {...props}
      to={to}
      outline="none"
      className={({ isActive }) =>
        clsx(
          getFocusClasses(true),
          'underline decoration-primary hover:decoration-secondary focus:decoration-secondary active:underline-offset-0',
          {
            'text-lg xl:text-xl 2xl:text-2xl decoration-4 underline-offset-4 hover:underline-offset-2': nav,
            'decoration-4 underline-offset-2 hover:underline-offset-1 ': !nav,
            'decoration-darkPrimary': isActive,
          },
          className,
        )
      }
    >
      {children}
    </UnstyledLink>
  );
}

export function MarkdownLinkWrapper({ href = '/404', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <StyledLink to={href} className="font-normal" {...props}>
      {children}
    </StyledLink>
  );
}

export function SkipToContentLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={clsx(
        'sr-only focus:not-sr-only transition p-3 -translate-y-16 focus:translate-y-0',
        getFocusClasses(true),
      )}
    >
      {children}
    </a>
  );
}
