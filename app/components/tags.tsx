import { Link, type LinkProps } from '@remix-run/react';
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

import { getFocusClasses } from '~/utilities/ariaClasses';

export function Tag({ children, className = '', ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={clsx(
        'p-1 rounded-lg bg-teal-900 hover:bg-teal-800 focus:bg-teal-800 text-white whitespace-nowrap text-xs lg:text-sm',
        getFocusClasses(true),
        className,
      )}
    >
      {children}
    </Link>
  );
}

type TagsProps = HTMLAttributes<HTMLUListElement> & {
  tags: string[];
};

export function Tags({ tags, children, className, ...props }: TagsProps) {
  return (
    <ul {...props} className={clsx('flex gap-2 flex-wrap', className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <Tag to={`?tag=${tag}`}>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}
