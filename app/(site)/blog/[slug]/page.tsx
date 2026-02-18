import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Script from 'next/script';
import { SectionHeading } from '~/components/headings.tsx';
import { fetchArticle } from '~/modules/blog/db/fetchArticle.server.ts';
import { fetchArticlesFrontmatter } from '~/modules/blog/db/fetchArticles.server.ts';
import { buildMetadata } from '~/next/lib/metadata.ts';
import { BlogMarkdownContainer, H1 } from '~/next/blog/components.tsx';
import { env } from '~/modules/env.server.ts';
import { getISODate, getReadableDate } from '~/utilities/dates.ts';

export const dynamicParams = false;

const redirects: Record<string, string | undefined> = {
  '2023-07-01_why_you_shouldnt_use_useactiondata': '2023-01-07_why_you_shouldnt_use_useactiondata',
  '2023-11-19_how-to-tame-the-unknown-and-anything-else': '2023-11-19_how-to-work-with-typescript-unknown-and-any',
};

type BlogArticlePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const articles = await fetchArticlesFrontmatter();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const slug = params.slug;

  if (redirects[slug]) {
    return buildMetadata({
      title: 'Blog',
      description: 'This is my personal blog! Find a list of all my posts here!',
    });
  }

  const [status, _state, article] = await fetchArticle(slug);
  if (status !== 200 || !article) {
    return buildMetadata({
      title: 'Blog',
      description: 'This is my personal blog! Find a list of all my posts here!',
    });
  }

  const title = article.title;
  return buildMetadata({
    title,
    description: article.description,
    image: article.imageUrl || `${env.server.origin}/img?src=${env.server.origin}/blog/${slug}.png&w=1200&h=1200`,
    imageAlt: article.imageAltText || `${title} by Andre Landgraf`,
    type: 'article',
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const slug = params.slug;

  if (Object.prototype.hasOwnProperty.call(redirects, slug)) {
    const newSlug = redirects[slug];
    if (newSlug) {
      redirect(`/blog/${newSlug}`);
    }
  }

  const [status, state, article] = await fetchArticle(slug);
  if (status !== 200 || !article) {
    if (status === 404) {
      notFound();
    }
    throw new Error(`Error (${status}) ${state}: Failed to fetch blog article.`);
  }

  return (
    <>
      <Script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" strategy="lazyOnload" />
      <article className="w-full max-w-7xl flex flex-col wide:m-auto gap-5 leading-loose">
        {article.newVersionSlug && article.newVersionTitle && (
          <div className="p-4 lg:p-8 bg-muted dark:bg-mutedDark text-mutedForeground dark:text-mutedDarkForeground font-semibold rounded-md">
            Hey! This article is outdated. You can find a newer article about this topic here:{' '}
            <Link href={`/blog/${article.newVersionSlug}`} className="underline">
              {article.newVersionTitle}
            </Link>
            .
          </div>
        )}
        <div className="flex flex-col gap-1">
          <H1>{article.title}</H1>
          <SectionHeading asParagraph>
            <time dateTime={getISODate(article.date)}>{getReadableDate(article.date)}</time>
          </SectionHeading>
        </div>
        <BlogMarkdownContainer className="w-full flex flex-col gap-5" content={article.content} />
      </article>
    </>
  );
}
