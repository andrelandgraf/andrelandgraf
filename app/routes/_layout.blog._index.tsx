import { json, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { ButtonLink } from '~/components/buttons';
import { PageHeading } from '~/components/headings';
import { Tags } from '~/components/tags';
import { fetchMarkdownFilesFs } from '~/modules/blog/fs/fetchMarkdownFiles.server';
import { fetchMarkdownFiles } from '~/modules/blog/github/fetchMarkdownFiles.server';
import { getPrivateEnvVars } from '~/modules/env.server';
import { getISODate, getReadableDate } from '~/utilities/dates';
import { getMetaTags } from '~/utilities/metaTags';

export const meta: MetaFunction = () => {
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

export async function loader() {
  const { githubAccessToken, githubRepoAPIUrl, readContentFrom } = getPrivateEnvVars();

  const mdFilesPromise =
    readContentFrom === 'production'
      ? fetchMarkdownFiles(githubAccessToken, `${githubRepoAPIUrl}/contents/articles`, validateFrontMatter)
      : fetchMarkdownFilesFs(`./contents/articles`, validateFrontMatter);

  const [status, state, files] = await mdFilesPromise;
  if (status !== 200 || !files) {
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }
  // sort by date (newest first)
  const entries = files.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });
  return json({ entries }, { headers: { 'cache-control': 'public, max-age=3600' } });
}

export default function Component() {
  const { entries } = useLoaderData<typeof loader>();

  return (
    <section className="flex flex-col gap-10">
      <PageHeading>My Blog Posts</PageHeading>
      {entries.map(({ frontmatter, slug }) => (
        <article className="flex flex-col gap-3 w-full lg:max-w-3xl" key={slug}>
          <Link to={`/blog/${slug}`} prefetch="intent">
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
    </section>
  );
}
