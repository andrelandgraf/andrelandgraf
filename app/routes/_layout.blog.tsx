import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData, useRouteError, useSearchParams } from '@remix-run/react';
import { captureRemixErrorBoundaryError } from '@sentry/remix';
import { PageHeading } from '~/components/headings.tsx';
import { SkipToContentLink, StyledLink } from '~/components/links.tsx';
import { Tags } from '~/components/tags.tsx';
import { fetchArticles } from '~/modules/blog/db/fetchArticles.server.ts';
import { getMetaTags } from '~/utilities/metaTags.ts';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data?.tag && data?.entries.length) {
    return getMetaTags({
      title: `${data.tag} | Blog`,
      description: `Hey there! I write about all things web development. Check out my blog posts about ${data.tag}.`,
    });
  }
  if (data?.tag && !data?.entries.length) {
    return getMetaTags({
      title: `Blog`,
      description: `No content found!`,
    });
  }
  return getMetaTags({
    title: 'Blog',
    description: 'Hey there! I write about all things web development. Check out my blog posts.',
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const tag = searchParams.get('tag');

  const articles = await fetchArticles();
  const entries = articles
    .filter((entry) => !tag || entry.categories.includes(tag))
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const tags = Array.from(
    new Set(
      entries.reduce((acc, entries) => {
        return [...acc, ...entries.categories];
      }, [] as string[]),
    ),
  );

  return json({ entries, tag, tags }, { headers: { 'cache-control': 'public, max-age=7200' } });
}

export default function Component() {
  const [searchParams] = useSearchParams();
  const question = searchParams.get('question');
  const { entries, tag, tags } = useLoaderData<typeof loader>();

  return (
    <section className="flex flex-col gap-10 w-full wide:items-center">
      <div className="flex flex-col gap-10 w-full lg:max-w-3xl wide:max-w-5xl wide:items-center">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-row gap-2">
            <PageHeading>
              {question
                ? 'Ask me about All Things Web'
                : tag && entries.length
                ? `All Things ${tag}`
                : 'All Things Web Blog Posts'}
            </PageHeading>
            <a title="RSS feed" href="/blog/rss">
              <img
                className="w-6 h-6 object-contain"
                src="/img/public/rss.png?w=24&h=24"
                alt="RSS logo"
                width="24"
                height="24"
              />
            </a>
          </div>
          <nav className="w-full flex flex-col gap-2">
            <SkipToContentLink className="sr-only focus:not-sr-only" href="#content">
              Skip to content
            </SkipToContentLink>
            <p>
              Filter blog posts by tag or{' '}
              <StyledLink to="/blog" preventScrollReset>
                show all
              </StyledLink>
              .
            </p>
            <Tags title="All tags" tags={tags} />
          </nav>
        </div>
      </div>
      <main id="content">
        <Outlet />
      </main>
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  const message = error instanceof Error ? error.message : 'An error occurred.';
  return (
    <section className="w-full flex flex-col items-center justify-center gap-10">
      <div className="text-center flex flex-col gap-2 border border-red p-8">
        <PageHeading>Something went wrong</PageHeading>
        <p className="text-center">{message}</p>
      </div>
    </section>
  );
}
