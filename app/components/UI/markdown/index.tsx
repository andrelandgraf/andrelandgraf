import type { FC, HTMLAttributes } from 'react';
import { useMemo } from 'react';
import { Fragment, createElement } from 'react';
import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import type { Options as RehypeReactOptions } from 'rehype-react';
import rehypeReact from 'rehype-react';

export * from './decoder';
export * from './paragraph';
export * from './pre';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type ReactOptions = PartialBy<RehypeReactOptions<typeof createElement>, 'createElement'>;

export const useRemarkSync = (source: string, rehypeReactOptions: ReactOptions): React.ReactElement =>
  useMemo(
    () =>
      unified()
        .use(remarkParse)
        .use(remarkToRehype)
        .use(rehypeReact, {
          createElement,
          Fragment,
          ...rehypeReactOptions,
        } as RehypeReactOptions<typeof createElement>)
        .processSync(source).result as React.ReactElement,
    [source, rehypeReactOptions],
  );

interface MarkdownContainerProps extends HTMLAttributes<HTMLDivElement> {
  source: string;
  components?: any;
}

const MarkdownContainer: FC<MarkdownContainerProps> = ({ source, components = {}, ...props }) => {
  const html = useRemarkSync(source, {
    // Optional: a mapping of html tags to custom React components
    components,
  });

  return <div {...props}>{html}</div>;
};

export default MarkdownContainer;

export { MarkdownContainer };
