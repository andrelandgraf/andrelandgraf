import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { CodeBlock } from '~/components/codeBlock';
import { SectionHeading } from '~/components/headings';
import { MarkdownLinkWrapper } from '~/components/links';
import { MarkdownContainer } from '~/components/markdown/renderer';
import { Quote, Statement } from '~/components/texts';
import { TweetEmbed } from '~/components/tweetEmbed';
import { Container, H1, Heading, List, ListItem, Paragraph, Table, TD, TH } from '~/modules/blog/components';
import { fetchMarkdownFileFs } from '~/modules/blog/fs/fetchMarkdownFile.server';
import { fetchMarkdownFile } from '~/modules/blog/github/fetchMarkdownFile.server';
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

type BlogArticleFrontmatter = {
  date: string;
  title: string;
  description: string;
  categories: string[];
  imageUrl?: string;
  imageAltText?: string;
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
      ? fetchMarkdownFile(githubAccessToken, `${githubRepoAPIUrl}/contents/articles`, slug, validateFrontMatter)
      : fetchMarkdownFileFs(`./contents/articles`, slug, validateFrontMatter);

  const [status, state, article] = await mdFilePromise;
  if (status !== 200 || !article) {
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }

  return json({ article }, { headers: { 'cache-control': 'public, max-age=3600' } });
}

export default function Component() {
  useTwitterEmbeds();
  const { article } = useLoaderData<typeof loader>();

  return (
    <article className="w-full max-w-7xl flex flex-col gap-5 leading-loose">
      <div className="flex flex-col gap-1">
        <H1>{article.frontmatter.title}</H1>
        <SectionHeading>
          <time dateTime={getISODate(article.frontmatter.date)}>{getReadableDate(article.frontmatter.date)}</time>
        </SectionHeading>
      </div>
      <MarkdownContainer
        className="w-full flex flex-col gap-5"
        content={article.content}
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
        }}
      />
    </article>
  );
}
