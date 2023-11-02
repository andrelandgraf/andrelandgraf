import type { NavLinkProps as RemixNavLinkProps } from '@remix-run/react';
import { NavLink } from '@remix-run/react';
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
      className={`${outline === 'none' ? '' : getAriaClasses(outline === 'small')} ${className}`}
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
        `${getFocusClasses(true)} underline decoration-primary hover:decoration-secondary focus:decoration-secondary ${
          nav
            ? 'text-lg xl:text-xl 2xl:text-2xl decoration-4 underline-offset-4 hover:underline-offset-2 active:underline-offset-0'
            : 'decoration-4 underline-offset-2 hover:underline-offset-1 active:underline-offset-0'
        } ${isActive ? 'pointer-events-none decoration-darkPrimary' : ''} ${className}`
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
