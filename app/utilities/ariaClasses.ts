import clsx from 'clsx';

export function getFocusClasses(smaller = false, hoverRingColorClassName?: string) {
  return clsx(
    'outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
    smaller ? 'focus-visible:ring-2' : 'focus-visible:ring-4',
    hoverRingColorClassName || 'focus-visible:ring-darkPrimary',
  );
}

export function getHoverClasses(smaller = false, focusRingColorClassName?: string) {
  return clsx(
    'outline-none hover:ring-offset-2 hover:ring-offset-transparent',
    smaller ? 'hover:ring-2' : 'hover:ring-4',
    focusRingColorClassName || 'hover:ring-darkPrimary',
  );
}

export type AriaClasses = {
  hoverRingColorClassName: string;
  focusRingColorClassName: string;
};

export function getAriaClasses(smaller = false, overrides?: AriaClasses) {
  return clsx(
    getFocusClasses(smaller, overrides?.focusRingColorClassName),
    getHoverClasses(smaller, overrides?.hoverRingColorClassName),
  );
}
