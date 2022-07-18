import type { LoaderFunction, LinksFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getPrivateEnvVars } from '~/config/env.server';
import type { MarkdownFile } from '~/actions/github/index.server';
import { fetchMarkdownFiles } from '~/actions/github/index.server';
import { fetchMarkdownFilesFs } from '~/actions/fs/index.server';
import { H1, H2, H3, ListItem, UnorderedList, OrderedList } from '~/components/100DaysOfCode/markdown';
import { MarkdownContainer } from '~/components/UI/markdown';
import { PageHeading, SectionHeading } from '~/components/UI/headings';
import { MarkdownLinkWrapper } from '~/components/UI/links';
import { getMetaTags, getISODate, getReadableDate } from '~/utilities';
import { useTwitterEmbeds } from '~/hooks';

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' },
  ];
};

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: '#100DaysOfCode',
    description: 'My Goals for the next 100 Days!',
  });
};

type HundredDaysOfCodeFrontmatter = {
  index: number;
  date: string;
  title: string;
  description: string;
  tweetUrl: string;
  categories?: string[];
};

const validateFrontMatter = (attributes: unknown): attributes is HundredDaysOfCodeFrontmatter => {
  return (
    !!attributes &&
    typeof attributes !== 'function' &&
    typeof attributes === 'object' &&
    (attributes as any)['tweetUrl'] &&
    typeof (attributes as any)['title'] === 'string' &&
    typeof (attributes as any)['index'] === 'number' &&
    typeof (attributes as any)['date'] === 'object'
  );
};

type LoaderData = {
  entries: MarkdownFile<HundredDaysOfCodeFrontmatter>[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { githubAccessToken, githubRepoAPIUrl, readContentFrom } = getPrivateEnvVars();

  const mdFilesPromise =
    readContentFrom === 'production'
      ? fetchMarkdownFiles(
          githubAccessToken,
          `${githubRepoAPIUrl}/contents/100DaysOfCode/2022-03-05`,
          validateFrontMatter,
        )
      : fetchMarkdownFilesFs(`./contents/100DaysOfCode/2022-03-05`, validateFrontMatter);

  const [status, state, files] = await mdFilesPromise;
  if (status !== 200 || !files) {
    throw Error(`Error (${status}) ${state}: Failed to fetch 100 days of code files.`);
  }
  // sort in descending order by index (newest first)
  const entries = files.sort((a, b) => (a.frontmatter.index > b.frontmatter.index ? -1 : 1));
  return { entries };
};

const HundredDaysOfCodePage = () => {
  useTwitterEmbeds();
  const { entries } = useLoaderData<LoaderData>();

  return (
    <section className="flex flex-col gap-20">
      <PageHeading className="font-gamified">100 Days of Code</PageHeading>
      {entries.map(({ frontmatter, markdown, slug }) => (
        <article className="flex flex-col gap-3" key={slug}>
          <SectionHeading className="w-full flex flex-col lg:flex-row flex-nowrap font-gamified">
            <span>{`Day ${frontmatter.index} of 100`}</span>
            <time className="lg:ml-auto" dateTime={getISODate(frontmatter.date)}>
              {getReadableDate(frontmatter.date)}
            </time>
          </SectionHeading>
          <div className="flex flex-col xl:flex-row-reverse gap-5 justify-between">
            {frontmatter.tweetUrl && (
              <blockquote className="twitter-tweet">
                <a href={frontmatter.tweetUrl}></a>
              </blockquote>
            )}
            <div>
              <h3 className="text-lg font-bold font-gamified">{`>>> ${frontmatter.title}`}</h3>
              <MarkdownContainer
                className="flex flex-col gap-3 max-w-2xl"
                source={markdown}
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
                  ul({ node, children, ...props }) {
                    return <UnorderedList {...props}>{children}</UnorderedList>;
                  },
                  ol({ node, children, ...props }) {
                    return <OrderedList {...props}>{children}</OrderedList>;
                  },
                  li({ node, children, ...props }) {
                    return <ListItem {...props}>{children}</ListItem>;
                  },
                  a({ node, children, ...props }) {
                    return <MarkdownLinkWrapper {...props}>{children}</MarkdownLinkWrapper>;
                  },
                }}
              />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default HundredDaysOfCodePage;
