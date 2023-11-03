import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData, useRouteError } from '@remix-run/react';

import { ButtonLink } from '~/components/buttons';
import { PageHeading } from '~/components/headings';
import { SkipToContentLink, StyledLink } from '~/components/links';
import { Tags } from '~/components/tags';
import { fetchMarkdownFilesFs } from '~/modules/blog/fs/fetchMarkdownFiles.server';
import { fetchMarkdownFiles } from '~/modules/blog/github/fetchMarkdownFiles.server';
import { getPrivateEnvVars } from '~/modules/env.server';
import { getFocusClasses } from '~/utilities/ariaClasses';
import { getISODate, getReadableDate } from '~/utilities/dates';
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

type BlogArticleFrontmatter = {
  date: string;
  title: string;
  description: string;
  categories: string[];
};

const validateFrontMatter = (attributes: unknown): attributes is BlogArticleFrontmatter => {
  return (
    !!attributes &&
    typeof attributes !== 'function' &&
    typeof attributes === 'object' &&
    typeof (attributes as any)['title'] === 'string' &&
    typeof (attributes as any)['description'] === 'string' &&
    Array.isArray((attributes as any)['categories']) &&
    typeof (attributes as any)['date'] === 'object'
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { githubAccessToken, githubRepoAPIUrl, readContentFrom } = getPrivateEnvVars();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const tag = searchParams.get('tag');

  const mdFilesPromise =
    readContentFrom === 'production'
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

  return json({ entries, tag, tags }, { headers: { 'cache-control': 'public, max-age=3600' } });
}

export default function Component() {
  const { entries, tag, tags } = useLoaderData<typeof loader>();

  return (
    <section className="flex flex-col gap-10 w-full lg:max-w-7xl">
      <div className="flex flex-col gap-2">
        <PageHeading>{tag && entries.length ? `All Things ${tag}` : 'All Things Web Blog Posts'}</PageHeading>
        <nav className="w-full flex flex-col gap-2">
          <p>
            {entries.length} blog posts found. Filter by tag or <StyledLink to="/blog">show all</StyledLink>
          </p>
          <SkipToContentLink className="sr-only focus:not-sr-only" to="#first-post">
            Skip to article
          </SkipToContentLink>
          <Tags title="All tags" tags={tags} className="flex gap-2" />
        </nav>
      </div>
      <ul className="flex flex-col gap-10" title="Articles">
        {entries.map(({ frontmatter, slug }, index) => (
          <article className="flex flex-col gap-3 w-full lg:max-w-3xl" key={slug}>
            <Link
              id={index === 0 ? 'first-post' : undefined}
              to={`/blog/${slug}`}
              prefetch="intent"
              className={getFocusClasses(true)}
            >
              <PageHeading asH2 className="text-secondary dark:text-primary">
                {frontmatter.title}
              </PageHeading>
            </Link>
            <h3>
              <time dateTime={getISODate(frontmatter.date)}>{getReadableDate(frontmatter.date)}</time>
            </h3>
            <Tags tags={frontmatter.categories} className="flex gap-2" />
            <p>{frontmatter.description}</p>
            <ButtonLink to={`/blog/${slug}`} aria-label={`View Article ${frontmatter.title}`} prefetch="intent">
              View Article
            </ButtonLink>
          </article>
        ))}
      </ul>
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : 'An error occurred.';
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <PageHeading>Blog</PageHeading>
        <p className="text-center">{message}</p>
      </div>
    </section>
  );
}
