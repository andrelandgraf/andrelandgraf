import type { RenderableTreeNode } from '@markdoc/markdoc';
import clsx from 'clsx';
import Link from 'next/link';
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react';
import { MarkdownContainer } from '~/components/markdown/renderer.tsx';
import { Quote, Statement } from '~/components/texts.tsx';
import { TweetEmbed } from '~/components/tweetEmbed.tsx';
import { getAriaClasses } from '~/utilities/ariaClasses.ts';

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

type CodeBlockProps = {
  language: string;
  innerHtml: string;
};

export function CodeBlock({ language, innerHtml }: CodeBlockProps) {
  return (
    <div className="p-2 lg:p-4 rounded-md font-normal text-sm md:text-base w-full bg-[#282A36] text-white">
      <div className="flex justify-end">
        <span className="mr-5 text-sm md:text-lg">{language}</span>
      </div>
      <pre className="overflow-scroll p-2 lg:p-4" dangerouslySetInnerHTML={{ __html: innerHtml }} />
    </div>
  );
}

function MarkdownLinkWrapper({ href = '/404', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const className = clsx(
    'font-normal underline decoration-primary hover:decoration-secondary focus:decoration-secondary',
    getAriaClasses(true),
    props.className,
  );

  if (href.startsWith('#') || URL.canParse(href)) {
    return (
      <a href={href} {...props} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props} className={className}>
      {children}
    </Link>
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

export function InlineCode({ content, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className="text-lg lg:text-xl xl:text-2xl font-light font-mono px-1 rounded-md bg-gray-100 dark:bg-gray-700"
      {...props}
    >
      {content}
    </code>
  );
}

type BlogMarkdownContainerProps = Omit<HTMLAttributes<HTMLElement>, 'content'> & {
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
        CodeBlock,
        Link: MarkdownLinkWrapper,
        TweetEmbed,
        Statement,
        Quote,
        Table,
        TH,
        TD,
        InlineCode,
      }}
    />
  );
}
