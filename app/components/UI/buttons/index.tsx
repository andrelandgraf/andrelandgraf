import type { PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import type { LinkProps } from '../links';
import { UnstyledLink } from '../links';
import { getFocusClasses } from '~/utilities';

type ButtonProps = PropsWithoutRef<
  {
    primary?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>;

type ButtonLinkProps = PropsWithoutRef<
  {
    primary?: boolean;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
  } & Omit<LinkProps, 'className' | 'children'>
>;

const getClasses = (primary: boolean, className: string, disabled: boolean) => {
  // inherited by all buttons
  const base = `flex gap-2 justify-center items-center mobile:w-full transform motion-safe:active:translate-y-px text-center font-semibold mobile:text-xs shadow-lg rounded-lg px-4 py-2 leading-relaxed
  ${disabled ? 'bg-gray-100 text-gray-700 pointer-events-none' : getFocusClasses()}`;
  // for normal button => will be overriden below (not inherited like base)
  let style = ``;
  if (primary) {
    style = 'text-black bg-primary hover:bg-secondary';
  } else {
    style = 'text-black bg-white hover:bg-secondary';
  }
  // inherited + button type + custom
  return `${base} ${style} ${className}`;
};

const ButtonLink = ({ children, primary = false, disabled = false, to, className = '', ...props }: ButtonLinkProps) => {
  return (
    <UnstyledLink
      {...props}
      to={to}
      aria-disabled={disabled}
      className={getClasses(primary, className, disabled)}
      outline="none"
    >
      {children}
    </UnstyledLink>
  );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type = 'button', primary = false, disabled = false, className = '', ...props }, ref) => {
    return (
      <button {...props} ref={ref} type={type} disabled={disabled} className={getClasses(primary, className, disabled)}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, ButtonLink };
