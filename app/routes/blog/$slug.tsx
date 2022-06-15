import type { LoaderFunction, MetaFunction, LinksFunction } from 'remix';
import { useLoaderData } from 'remix';
import { getPrivateEnvVars } from '~/config/env.server';
import type { MarkdownFile } from '~/actions/github/index.server';
import { fetchMarkdownFile } from '~/actions/github/index.server';
import { fetchMarkdownFileFs } from '~/actions/fs/index.server';
import { MarkdownContainer } from '~/components/UI/markdown';
import { CodeBlock } from '~/components/UI/markdown/pre';
import { H1, H2, H3, P, ListItem, OrderedList, UnorderedList, Code } from '~/components/blog/markdown';
import { SectionHeading } from '~/components/UI/headings';
import { MarkdownLinkWrapper } from '~/components/UI/links';
import { getMetaTags, getISODate, getReadableDate } from '~/utilities';

import syntaxHighlightingStylesUrl from '~/styles/code.css';
import { useTwitterEmbeds } from '~/hooks';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: syntaxHighlightingStylesUrl }];
};

export const meta: MetaFunction = ({ data }) => {
  return getMetaTags({
    title: data?.article.frontmatter.title || 'Blog',
    description: data?.article.frontmatter.description || 'This is my personal blog! Find a list of all my posts here!',
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

type LoaderData = {
  article: MarkdownFile<BlogArticleFrontmatter>;
};

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  const { githubAccessToken, githubRepoAPIUrl, readContentFrom } = getPrivateEnvVars();
  const { slug } = params;

  if (!slug) {
    throw Error('No article specified');
  }

  const mdFilePromise =
    readContentFrom === 'production'
      ? fetchMarkdownFile(githubAccessToken, `${githubRepoAPIUrl}/contents/articles`, slug, validateFrontMatter)
      : fetchMarkdownFileFs(`./contents/articles`, slug, validateFrontMatter);

  const [status, state, article] = await mdFilePromise;
  if (status !== 200 || !article) {
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }

  return { article };
};

const ArticlePage = () => {
  useTwitterEmbeds();
  const { article } = useLoaderData<LoaderData>();

  return (
    <article className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <H1>{article.frontmatter.title}</H1>
        <SectionHeading>
          <time dateTime={getISODate(article.frontmatter.date)}>{getReadableDate(article.frontmatter.date)}</time>
        </SectionHeading>
      </div>
      <MarkdownContainer
        className="flex flex-col gap-5 max-w-7xl"
        source={article.markdown}
        components={{
          h1({ node, children, ...props }) {
            return <H1 {...props}>{children}</H1>;
          },
          h2({ node, children, ...props }) {
            return <H2 {...props}>{children}</H2>;
          },
          h3({ node, children, ...props }) {
            return <H3 {...props}>{children}</H3>;
          },
          p({ node, children, ...props }) {
            return <P {...props}>{children}</P>;
          },
          ol({ node, children, ...props }) {
            return <OrderedList {...props}>{children}</OrderedList>;
          },
          ul({ node, children, ...props }) {
            return <UnorderedList {...props}>{children}</UnorderedList>;
          },
          li({ node, children, ...props }) {
            return <ListItem {...props}>{children}</ListItem>;
          },
          code({ node, children, ...props }) {
            return <Code {...props}>{children}</Code>;
          },
          pre({ node, children, ...props }) {
            return <CodeBlock {...props}>{children}</CodeBlock>;
          },
          a({ node, children, ...props }) {
            return <MarkdownLinkWrapper {...props}>{children}</MarkdownLinkWrapper>;
          },
        }}
      />
    </article>
  );
};

export default ArticlePage;
