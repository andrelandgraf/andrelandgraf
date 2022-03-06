import type { LoaderFunction } from 'remix';
import { useLoaderData } from 'remix';
import { getPrivateEnvVars } from '~/config/env.server';
import type { MarkdownFile } from '~/actions/github/index.server';
import { fetchMarkdownFiles } from '~/actions/github/index.server';
import { H1, H2, H3, ListItem, UnorderedList, OrderedList } from '~/components/100DaysOfCode/markdown';
import { MarkdownContainer } from '~/components/UI/markdown';
import { PageHeading, SectionHeading } from '~/components/UI/headings';

type HundredDaysOfCodeFrontmatter = {
  title: string;
  description: string;
  tweetUrl: string;
  categories?: string[];
};

const validateFrontMatter = (attributes: unknown): attributes is HundredDaysOfCodeFrontmatter => {
  return true;
};

type LoaderData = {
  entries: Array<MarkdownFile<HundredDaysOfCodeFrontmatter>>;
  startDate: string;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { githubAccessToken, githubRepoAPIUrl } = getPrivateEnvVars();
  const [status, state, entries] = await fetchMarkdownFiles(
    githubAccessToken,
    `${githubRepoAPIUrl}/contents/100DaysOfCode/2022-03-05`,
    validateFrontMatter,
  );
  if (status !== 200 || !entries) {
    throw Error(`Error (${status}) ${state}: Failed to fetch 100 days of code files.`);
  }
  // sort in descending order by index (newest first)
  entries.sort((a, b) => (a.slug > b.slug ? 1 : -1));
  return { entries, startDate: '2022-03-05' };
};

function getReadableDate(dateStr: string, index: number): string {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
  const datePlusIndex = new Date(date.getTime() + index * 24 * 60 * 60 * 1000);
  return datePlusIndex.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getISODate(dateStr: string, index: number): string {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
  const datePlusIndex = new Date(date.getTime() + index * 24 * 60 * 60 * 1000);
  return datePlusIndex.toISOString();
}

const HundredDaysOfCodePage = () => {
  const { entries, startDate } = useLoaderData<LoaderData>();

  return (
    <section className="flex flex-col gap-20">
      <PageHeading>100 Days of Code</PageHeading>
      {entries.map(({ frontmatter, markdown, slug }, index) => (
        <article className="flex flex-col gap-5" key={slug}>
          <div>
            <SectionHeading className="w-full flex flex-col">
              <span>{`Day ${index} of 100`}</span>
              <time className="ml-auto" dateTime={getISODate(startDate, index)}>
                {getReadableDate(startDate, index)}
              </time>
            </SectionHeading>
            <p>{frontmatter.title}</p>
          </div>
          {frontmatter.tweetUrl && (
            <blockquote className="twitter-tweet">
              <a href={frontmatter.tweetUrl}></a>
            </blockquote>
          )}
          <MarkdownContainer
            className="flex flex-col gap-3"
            source={markdown}
            options={{
              components: {
                h1: H1,
                h2: H2,
                h3: H3,
                ul: UnorderedList,
                ol: OrderedList,
                li: ListItem,
              },
            }}
          />
        </article>
      ))}
    </section>
  );
};

export default HundredDaysOfCodePage;
