import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Outlet, useLoaderData, useRouteError, useSearchParams } from '@remix-run/react';
import clsx from 'clsx';

import { Textarea } from '~/components/forms';
import { PageHeading } from '~/components/headings';
import { SkipToContentLink, StyledLink } from '~/components/links';
import { Tags } from '~/components/tags';
import { fetchArticles } from '~/modules/blog/db/fetchArticles.server';
import { fetchMarkdownFilesFs } from '~/modules/blog/fs/fetchMarkdownFiles.server';
import { fetchMarkdownFiles } from '~/modules/blog/github/fetchMarkdownFiles.server';
import { validateFrontMatter } from '~/modules/blog/validation.server';
import { getPrivateEnvVars } from '~/modules/env.server';
import { getFocusClasses } from '~/utilities/ariaClasses';
import { getMetaTags } from '~/utilities/metaTags';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data?.tag && data?.entries.length) {
    return getMetaTags({
      title: `${data.tag} | Blog`,
      description: `Check out my blog posts about ${data.tag}.`,
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
    description: 'Check out my blog posts. I write about all things web development.',
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { githubAccessToken, githubRepoAPIUrl, readContentFrom } = getPrivateEnvVars();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const tag = searchParams.get('tag');

  const mdFilesPromise =
    readContentFrom === 'production'
      ? fetchArticles()
      : readContentFrom === 'github'
      ? fetchMarkdownFiles(githubAccessToken, `${githubRepoAPIUrl}/contents/articles`, validateFrontMatter)
      : fetchMarkdownFilesFs(`./contents/articles`, validateFrontMatter);

  const [status, state, files] = await mdFilesPromise;
  if (status !== 200 || !files) {
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }
  const entries = files
    .filter((entry) => !tag || entry.frontmatter.categories.includes(tag))
    .sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

  const tags = Array.from(
    new Set(
      entries.reduce((acc, entries) => {
        return [...acc, ...entries.frontmatter.categories];
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
    <section className="flex flex-col gap-10 w-full lg:max-w-3xl">
      <div className="flex flex-col gap-2">
        <PageHeading>
          {question
            ? 'Ask me about All Things Web'
            : tag && entries.length
            ? `All Things ${tag}`
            : 'All Things Web Blog Posts'}
        </PageHeading>
        <nav className="w-full flex flex-col gap-2">
          <SkipToContentLink className="sr-only focus:not-sr-only" href="#content">
            Skip to content
          </SkipToContentLink>
          <p>
            Filter blog posts by tag, <StyledLink to="/blog">show all</StyledLink> or{' '}
            <StyledLink to="#ask">ask a question</StyledLink>.
          </p>
          <Tags title="All tags" tags={tags} />
        </nav>
      </div>
      <Form method="GET" action="/blog/ask" className="flex flex-row gap-2 relative">
        <Textarea
          defaultValue={question || undefined}
          name="question"
          placeholder="Why is Remix a full stack web framework?"
          label="All content at your fingertips. Ask a question about all things web."
          id="ask"
        />
        <button className={clsx(getFocusClasses(true), 'absolute bottom-2 right-2')} type="submit">
          » Ask
        </button>
      </Form>
      <main id="content">
        <Outlet />
      </main>
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
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
