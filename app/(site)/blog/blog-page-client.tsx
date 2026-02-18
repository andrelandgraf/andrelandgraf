'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { PageHeading } from '~/components/headings.tsx';
import type { ArticleListItem } from '~/modules/blog/db/fetchArticles.server.ts';
import { getFocusClasses } from '~/utilities/ariaClasses.ts';
import { getISODate, getReadableDate } from '~/utilities/dates.ts';

function TagLink({ tag }: { tag: string }) {
  return (
    <Link
      href={`/blog?tag=${encodeURIComponent(tag)}`}
      className={`p-1 rounded-lg bg-teal-900 hover:bg-teal-800 focus:bg-teal-800 text-white whitespace-nowrap text-xs lg:text-sm ${getFocusClasses(
        true,
      )}`}
    >
      {tag}
    </Link>
  );
}

type BlogPageContentProps = {
  entries: ArticleListItem[];
  tag?: string;
  question?: string;
};

function BlogPageContent({ entries, tag, question }: BlogPageContentProps) {
  const tags = Array.from(
    new Set(
      entries.reduce((acc, entry) => {
        return [...acc, ...entry.categories];
      }, [] as string[]),
    ),
  );

  return (
    <section className="flex flex-col gap-10 w-full wide:items-center">
      <div className="flex flex-col gap-10 w-full lg:max-w-3xl wide:max-w-5xl wide:items-center">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-row gap-2">
            <PageHeading>
              {question ? 'Ask me about All Things Web' : tag && entries.length ? `All Things ${tag}` : 'All Things Web Blog Posts'}
            </PageHeading>
            <a title="RSS feed" href="/blog/rss">
              <img className="w-6 h-6 object-contain" src="/rss.png" alt="RSS logo" width="24" height="24" loading="lazy" />
            </a>
          </div>
          <nav className="w-full flex flex-col gap-2">
            <p>
              Filter blog posts by tag or{' '}
              <Link href="/blog" className={`underline decoration-primary decoration-4 underline-offset-2 ${getFocusClasses(true)}`}>
                show all
              </Link>
              .
            </p>
            <ul className="flex gap-2 flex-wrap" title="All tags">
              {tags.map((blogTag) => (
                <li key={blogTag}>
                  <TagLink tag={blogTag} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <main id="content" className="w-full lg:max-w-3xl wide:max-w-5xl">
        <ul className="w-full flex flex-col gap-10" title="Articles">
          {entries.map((article) => (
            <li key={article.slug}>
              <article className="flex flex-col gap-3 w-full">
                <Link href={`/blog/${article.slug}`} className={getFocusClasses(true)}>
                  <PageHeading asH2 className="text-primaryDark dark:text-primary font-bold">
                    {article.title}
                  </PageHeading>
                </Link>
                <h3>
                  <time dateTime={getISODate(article.date)}>{getReadableDate(article.date)}</time>
                </h3>
                <ul className="flex gap-2 flex-wrap">
                  {article.categories.map((category) => (
                    <li key={`${article.slug}-${category}`}>
                      <TagLink tag={category} />
                    </li>
                  ))}
                </ul>
                <p>{article.description}</p>
                <Link
                  href={`/blog/${article.slug}`}
                  className={`w-full md:w-fit flex gap-2 justify-center items-center mobile:w-full transform motion-safe:active:translate-y-px text-center font-semibold shadow-lg rounded-lg px-4 py-2 leading-relaxed text-black bg-primary hover:bg-secondary ${getFocusClasses(
                    true,
                  )}`}
                  aria-label={`View Article ${article.title}`}
                >
                  View Article
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}

export function BlogPageClient({ articles }: { articles: ArticleListItem[] }) {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag') ?? undefined;
  const question = searchParams.get('question') ?? undefined;

  const entries = useMemo(() => {
    return articles
      .filter((entry) => !tag || entry.categories.includes(tag))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles, tag]);

  return <BlogPageContent entries={entries} tag={tag} question={question} />;
}

export function BlogPageFallback({ articles }: { articles: ArticleListItem[] }) {
  const entries = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return <BlogPageContent entries={entries} />;
}
