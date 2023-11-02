import type { HTMLAttributes } from 'react';

export function Statement({ children }: HTMLAttributes<HTMLElement>) {
  return (
    <p className="flex items-center gap-4 p-4 rounded-md border border-primary">
      <span className="text-primary text-4xl font-bold">🎯</span>
      {children}
    </p>
  );
}

type QuoteProps = HTMLAttributes<HTMLElement> & {
  author?: string;
  url?: string;
};

export function Quote({ children, author, url, ...props }: QuoteProps) {
  return (
    <blockquote cite={url} className="w-full">
      <p className="inline">
        <span className="text-primary text-3xl font-bold">&quot;</span>
        {children}
        <span className="text-primary text-3xl font-bold">&quot;</span>
      </p>
      {author && (
        <aside className="inline">
          <span className="text-3xl font-bold"> &minus;</span>
          <cite> {author}</cite>
        </aside>
      )}
    </blockquote>
  );
}
