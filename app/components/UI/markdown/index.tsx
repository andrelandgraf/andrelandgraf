import type { FC, HTMLAttributes } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

export * from './decoder';
export * from './paragraph';
export * from './pre';

interface MarkdownContainerProps extends HTMLAttributes<HTMLDivElement> {
  source: string;
  components?: Components;
}

const MarkdownContainer: FC<MarkdownContainerProps> = ({ source, components, ...props }) => {
  return (
    <div {...props}>
      <ReactMarkdown components={components}>{source}</ReactMarkdown>
    </div>
  );
};

export { MarkdownContainer };
