import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { SectionHeading } from '~/components/headings.tsx';
import { BlogMarkdownContainer, H1 } from '~/modules/blog/components.tsx';
import { fetchArticle } from '~/modules/blog/db/fetchArticle.server.ts';
import { useTwitterEmbeds } from '~/modules/twitter-embeds.ts';
import { getISODate, getReadableDate } from '~/utilities/dates.ts';
import { getMetaTags } from '~/utilities/metaTags.ts';
import { env } from '~/modules/env.server.ts';
import { StyledLink } from '~/components/links';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return getMetaTags({
      title: 'Blog',
      description: 'This is my personal blog! Find a list of all my posts here!',
    });
  }
  const tile = data.article.title;
  return getMetaTags({
    title: tile,
    description: data.article.description,
    image:
      data?.article.imageUrl ||
      `${data.serverOrigin}/img?src=${data.serverOrigin}/blog/${data.article.slug}.png&w=1200&h=1200`,
    imageAlt: data?.article.imageAltText || `${tile} by Andre Landgraf`,
    type: 'article',
  });
};

const redirects: Record<string, string | undefined> = {
  '2023-07-01_why_you_shouldnt_use_useactiondata': '2023-01-07_why_you_shouldnt_use_useactiondata',
  '2023-11-19_how-to-tame-the-unknown-and-anything-else': '2023-11-19_how-to-work-with-typescript-unknown-and-any',
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw Error('No article specified');
  }

  if (Object.keys(redirects).includes(slug)) {
    const newSlug = redirects[slug];
    if (newSlug) {
      return redirect(`/blog/${newSlug}`);
    }
  }

  const [status, state, article] = await fetchArticle(slug);
  if (status !== 200 || !article) {
    if (status === 404) {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    }
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }

  return json({ article, serverOrigin: env.server.origin }, { headers: { 'cache-control': 'public, max-age=7200' } });
}

export default function Component() {
  useTwitterEmbeds();
  const { article } = useLoaderData<typeof loader>();

  return (
    <article className="w-full max-w-7xl flex flex-col wide:m-auto gap-5 leading-loose">
      {article.newVersionSlug && article.newVersionTitle && (
        <div className="p-4 lg:p-8 bg-muted dark:bg-mutedDark text-mutedForeground dark:text-mutedDarkForeground font-semibold rounded-md">
          Hey! This article is outdated. You can find a newer article about this topic here:{' '}
          <StyledLink prefetch="intent" to={`/blog/${article.newVersionSlug}`}>
            {article.newVersionTitle}
          </StyledLink>
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
  );
}
