import type { FC, PropsWithChildren } from 'react';
import type { IsomorphicLinkProps } from 'react-router-isomorphic-link';
import { IsomorphicLink } from 'react-router-isomorphic-link';
import { getAriaClasses, getFocusClasses } from '~/utilities';

type UnstyledLinkProps = {
  outline?: 'normal' | 'small' | 'none';
} & IsomorphicLinkProps;

type LinkProps = {
  nav?: boolean;
  className?: string;
} & Omit<UnstyledLinkProps, 'className'>;

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
      to={to}
      className={`${outline === 'none' ? '' : getAriaClasses(outline === 'small')} ${className}`}
      prefetch="intent"
      end
    >
      {children}
    </IsomorphicLink>
  );
};

const StyledLink: FC<PropsWithChildren<LinkProps>> = ({ to, nav = false, className = '', children, ...props }) => {
  return (
    <UnstyledLink
      {...props}
      to={to}
      outline="none"
      className={({ isActive }) =>
        `${getFocusClasses(true)} underline decoration-primary hover:decoration-secondary focus:decoration-secondary ${
          nav
            ? 'text-xl xl:text-2xl 2xl:text-4xl decoration-8 underline-offset-4 hover:underline-offset-2 active:underline-offset-0'
            : 'decoration-4 underline-offset-2 hover:underline-offset-1 active:underline-offset-0'
        } font-bold ${isActive ? 'pointer-events-none decoration-darkPrimary' : ''} ${className}`
      }
    >
      {children}
    </UnstyledLink>
  );
};

export type { LinkProps };

export { UnstyledLink, StyledLink };
