import type { NavLinkProps } from 'remix';

const getNavLinkClasses = (className: NavLinkProps['className'], isActive: boolean): string => {
  if (!className) {
    return '';
  }
  if (typeof className === 'string') {
    return className;
  }
  return className({ isActive });
};

export { getNavLinkClasses };
