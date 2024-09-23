import type { RenderableTreeNode } from '@markdoc/markdoc';
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

import { MarkdownLinkWrapper } from '~/components/links';
import { CodeBlock, MarkdownContainer } from '~/components/markdown/renderer';
import { Quote, Statement } from '~/components/texts';
import { TweetEmbed } from '~/components/tweetEmbed';

export function Container({ children }: HTMLAttributes<HTMLElement>) {
  return children;
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: number;
};

export function H1({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 {...props} className="text-3xl lg:text-4xl xl:text-6xl text-primaryDark dark:text-primary font-extrabold">
      {children}
    </h1>
  );
}

export function Heading({ children, level = 2, ...props }: HeadingProps) {
  if (level === 1 || level === 2) {
    return (
      <h2
        {...props}
        className="text-2xl lg:text-3xl xl:text-4xl text-secondary dark:text-primary font-bold mt-6 lg:mt-8"
      >
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3
        {...props}
        className="text-xl lg:text-2xl xl:text-3xl font-semibold text-secondary dark:text-primary mt-4 lg:mt-6"
      >
        {children}
      </h3>
    );
  }
  if (level === 4) {
    return (
      <h4
        {...props}
        className="text-lg lg:text-xl xl:text-2xl font-normal text-secondary dark:text-primary mt-2 lg:mt-4"
      >
        {children}
      </h4>
    );
  }
  return (
    <h5 className="text-lg lg:text-xl xl:text-2xl" {...props}>
      {children}
    </h5>
  );
}

type ListProps = HTMLAttributes<HTMLElement> & {
  ordered?: boolean;
};

export function List({ children, ordered, ...props }: ListProps) {
  if (ordered) {
    return (
      <ol className="list-inside list-decimal" {...props}>
        {children}
      </ol>
    );
  }
  return (
    <ul className="list-disc list-inside" {...props}>
      {children}
    </ul>
  );
}

export function ListItem({ children, ...props }: HTMLAttributes<HTMLLIElement>) {
  return (
    <li className="pl-4 lg:mb-1 w-full text-lg lg:text-xl xl:text-2xl font-light" {...props}>
      {children}
    </li>
  );
}

export function Paragraph({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props} className="text-lg lg:text-xl xl:text-2xl font-light">
      {children}
    </p>
  );
}

export function Table({ children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div>
      <table {...props} className="border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TH({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th {...props} className="p-2 border border-gray-300">
      {children}
    </th>
  );
}

type TDProps = HTMLAttributes<HTMLTableCellElement> & {
  color?: 'green' | 'red' | 'default';
};

export function TD({ children, color = 'default', ...props }: TDProps) {
  return (
    <td
      {...props}
      className={clsx('p-2 border border-gray-300', color === 'green' && 'text-green', color === 'red' && 'text-red')}
    >
      {children}
    </td>
  );
}

export function InlineCode({ children, ...props }: HTMLAttributes<HTMLElement>) {
  console.log('InlineCode', children);
  return (
    <code className="text-lg lg:text-xl xl:text-2xl font-light font-mono p-1 bg-gray-200 dark:bg-gray-500" {...props}>
      {children}
    </code>
  );
}

type BlogMarkdownContainerProps = HTMLAttributes<HTMLElement> & {
  content: RenderableTreeNode;
};

export function BlogMarkdownContainer({ content, ...props }: BlogMarkdownContainerProps) {
  return (
    <MarkdownContainer
      {...props}
      content={content}
      components={{
        Container,
        Heading,
        Paragraph,
        List,
        ListItem,
        CodeBlock: CodeBlock,
        Link: MarkdownLinkWrapper,
        TweetEmbed: TweetEmbed,
        Statement: Statement,
        Quote: Quote,
        Table,
        TH,
        TD,
        InlineCode,
      }}
    />
  );
}
