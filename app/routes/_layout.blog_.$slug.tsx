import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { SectionHeading } from '~/components/headings';
import { BlogMarkdownContainer, H1 } from '~/modules/blog/components';
import { fetchArticle } from '~/modules/blog/db/fetchArticle.server';
import { fetchMarkdownFileFs } from '~/modules/blog/fs/fetchMarkdownFile.server';
import { fetchMarkdownFile } from '~/modules/blog/github/fetchMarkdownFile.server';
import { validateFrontMatter } from '~/modules/blog/validation.server';
import { getPrivateEnvVars } from '~/modules/env.server';
import { useTwitterEmbeds } from '~/modules/twitter-embeds';
import syntaxHighlightingStylesUrl from '~/styles/code.css';
import { getISODate, getReadableDate } from '~/utilities/dates';
import { getMetaTags } from '~/utilities/metaTags';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: syntaxHighlightingStylesUrl }];
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getMetaTags({
    title: data?.article.frontmatter.title || 'Blog',
    description: data?.article.frontmatter.description || 'This is my personal blog! Find a list of all my posts here!',
    image: data?.article.frontmatter.imageUrl,
    imageAlt: data?.article.frontmatter.imageAltText,
    type: 'article',
  });
};

const redirects: Record<string, string | undefined> = {
  '2023-07-01_why_you_shouldnt_use_useactiondata': '2023-01-07_why_you_shouldnt_use_useactiondata',
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { githubAccessToken, githubRepoAPIUrl, readContentFrom } = getPrivateEnvVars();
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

  const mdFilePromise =
    readContentFrom === 'production'
      ? fetchArticle(slug)
      : readContentFrom === 'github'
      ? fetchMarkdownFile(githubAccessToken, `${githubRepoAPIUrl}/contents/articles`, slug, validateFrontMatter)
      : fetchMarkdownFileFs(`./contents/articles`, slug, validateFrontMatter);

  const [status, state, article] = await mdFilePromise;
  if (status !== 200 || !article) {
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }

  return json({ article }, { headers: { 'cache-control': 'public, max-age=7200' } });
}

export default function Component() {
  useTwitterEmbeds();
  const { article } = useLoaderData<typeof loader>();

  return (
    <article className="w-full max-w-7xl flex flex-col wide:m-auto gap-5 leading-loose">
      <div className="flex flex-col gap-1">
        <H1>{article.frontmatter.title}</H1>
        <SectionHeading>
          <time dateTime={getISODate(article.frontmatter.date)}>{getReadableDate(article.frontmatter.date)}</time>
        </SectionHeading>
      </div>
      <BlogMarkdownContainer className="w-full flex flex-col gap-5" content={article.content} />
    </article>
  );
}
