import type { HTMLAttributes } from 'react';

export function Tag({ children, className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className={`p-1 rounded-lg bg-darkPrimary text-white text-xs lg:text-sm ${className}`}>
      {children}
    </span>
  );
}

type TagsProps = HTMLAttributes<HTMLParagraphElement> & {
  tags: string[];
};

export function Tags({ tags, children, ...props }: TagsProps) {
  return (
    <p {...props}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </p>
  );
}
