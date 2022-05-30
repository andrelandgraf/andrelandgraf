import type { FC, HTMLAttributes, PropsWithChildren } from 'react';

export const Tag: FC<PropsWithChildren<HTMLAttributes<HTMLSpanElement>>> = ({ children, className = '', ...props }) => {
  return (
    <span {...props} className={`p-1 rounded-lg bg-darkPrimary text-white text-xs lg:text-sm ${className}`}>
      {children}
    </span>
  );
};

type TagsProps = HTMLAttributes<HTMLParagraphElement> & {
  tags: string[];
};

export const Tags: FC<PropsWithChildren<TagsProps>> = ({ tags, children, ...props }) => {
  return (
    <p {...props}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </p>
  );
};
