import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { Fragment, createElement } from 'react';
import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import type { Options as RehypeReactOptions } from 'rehype-react';
import rehypeReact from 'rehype-react';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type ReyhpeOptions = PartialBy<RehypeReactOptions<typeof createElement>, 'createElement'>;

// TODO npm i react-remark (v2) once esm supported and use sync hook from there
const useMarkdown = (source: string, rehypeReactOptions: ReyhpeOptions = {}): ReactElement =>
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
        .processSync(source).result as ReactElement,
    [source, rehypeReactOptions],
  );

export type { ReyhpeOptions };

export { useMarkdown };
