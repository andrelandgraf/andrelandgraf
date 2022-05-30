import type { LoaderFunction, MetaFunction } from 'remix';
import { useLoaderData } from 'remix';
import { getPrivateEnvVars } from '~/config/env.server';
import type { MarkdownFile } from '~/actions/github/index.server';
import { fetchMarkdownFiles } from '~/actions/github/index.server';
import { fetchMarkdownFilesFs } from '~/actions/fs/index.server';
import { PageHeading, SectionHeading } from '~/components/UI/headings';
import { getMetaTags, getISODate, getReadableDate } from '~/utilities';
import { ButtonLink } from '~/components/UI/buttons';
import { Tags } from '~/components/UI/tag';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'Blog',
    description: 'This is my personal blog! Find a list of all my posts here!',
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
  entries: MarkdownFile<BlogArticleFrontmatter>[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
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
  return { entries };
};

const BlogPage = () => {
  const { entries } = useLoaderData<LoaderData>();

  return (
    <section className="flex flex-col gap-10">
      <PageHeading>My Blog Posts</PageHeading>
      {entries.map(({ frontmatter, slug }) => (
        <article className="flex flex-col gap-3 w-full lg:max-w-3xl" key={slug}>
          <SectionHeading>{frontmatter.title}</SectionHeading>
          <h3>
            <time dateTime={getISODate(frontmatter.date)}>{getReadableDate(frontmatter.date)}</time>
          </h3>
          <Tags tags={frontmatter.categories} className="flex gap-2" />
          <p>{frontmatter.description}</p>
          <ButtonLink to={`/blog/${slug}`}>View Article</ButtonLink>
        </article>
      ))}
    </section>
  );
};

export default BlogPage;
