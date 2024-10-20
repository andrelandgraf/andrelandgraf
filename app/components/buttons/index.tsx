import clsx from 'clsx';
import type { ButtonHTMLAttributes, PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import type { AriaClasses } from '~/utilities/ariaClasses.ts';
import { getAriaClasses, getFocusClasses } from '~/utilities/ariaClasses.ts';
import type { LinkProps } from '../links.tsx';
import { UnstyledLink } from '../links.tsx';

type ButtonOverrides = {
  colorClassName: string;
  textSizeClassName?: string;
} & AriaClasses;

type ButtonProps = PropsWithoutRef<
  {
    overrides?: ButtonOverrides;
    primary?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>;

type ButtonLinkProps = PropsWithoutRef<
  {
    primary?: boolean;
    disabled?: boolean;
    className?: string;
    overrides?: ButtonOverrides;
    children?: React.ReactNode;
  } & Omit<LinkProps, 'className' | 'children'>
>;

const getClasses = (primary: boolean, className: string, overrides: ButtonOverrides | undefined, disabled: boolean) => {
  // inherited by all buttons
  const base = clsx(
    'flex gap-2 justify-center items-center mobile:w-full transform motion-safe:active:translate-y-px text-center font-semibold shadow-lg rounded-lg px-4 py-2 leading-relaxed',
    overrides?.textSizeClassName || 'mobile:text-xs',
    disabled
      ? 'bg-gray-300 text-gray-700 pointer-events-none'
      : getFocusClasses(true, overrides?.focusRingColorClassName),
  );

  if (overrides) {
    return clsx(base, overrides.colorClassName, className);
  }

  let style;
  if (primary) {
    style = 'text-black bg-primary hover:bg-secondary';
  } else {
    style = 'text-black bg-gray-100 dark:bg-white hover:bg-secondary';
  }
  // inherited + button type + custom
  return clsx(base, style, className);
};

export function ButtonLink({
  children,
  primary = false,
  disabled = false,
  to,
  className = '',
  overrides,
  ...props
}: ButtonLinkProps) {
  return (
    <div className="w-full md:w-fit">
      <UnstyledLink
        {...props}
        to={to}
        aria-disabled={disabled}
        className={getClasses(primary, className, overrides, disabled)}
        outline="none"
      >
        {children}
      </UnstyledLink>
    </div>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type = 'button', primary = false, disabled = false, className = '', overrides, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled}
        className={getClasses(primary, className, overrides, disabled)}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export function IconButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`transform motion-safe:hover:scale-105 ${getAriaClasses(true)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
