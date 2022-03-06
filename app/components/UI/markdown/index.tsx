import type { FC, HTMLAttributes } from 'react';
import type { ReyhpeOptions } from '~/hooks';
import { useMarkdown } from '~/hooks';

interface MarkdownContainerProps extends HTMLAttributes<HTMLDivElement> {
  source: string;
  options?: ReyhpeOptions;
}

const MarkdownContainer: FC<MarkdownContainerProps> = ({ source, options, ...props }) => {
  const html = useMarkdown(source, options);
  return <div {...props}>{html}</div>;
};

export { MarkdownContainer };
