import type { LoaderFunction, LinksFunction, MetaFunction } from 'remix';
import { useLoaderData } from 'remix';
import { getPrivateEnvVars } from '~/config/env.server';
import type { MarkdownFile } from '~/actions/github/index.server';
import { fetchMarkdownFiles } from '~/actions/github/index.server';
import { H1, H2, H3, ListItem, UnorderedList, OrderedList } from '~/components/100DaysOfCode/markdown';
import { MarkdownContainer } from '~/components/UI/markdown';
import { PageHeading, SectionHeading } from '~/components/UI/headings';
import { getMetaTags } from '~/utilities';

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
    (attributes as any)['title']
  );
};

type JournalEntry = MarkdownFile<HundredDaysOfCodeFrontmatter> & {
  day: number;
  index: number;
};

type LoaderData = {
  entries: Array<JournalEntry>;
  startDate: string;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { githubAccessToken, githubRepoAPIUrl } = getPrivateEnvVars();
  const [status, state, files] = await fetchMarkdownFiles(
    githubAccessToken,
    `${githubRepoAPIUrl}/contents/100DaysOfCode/2022-03-05`,
    validateFrontMatter,
  );
  if (status !== 200 || !files) {
    throw Error(`Error (${status}) ${state}: Failed to fetch 100 days of code files.`);
  }
  // sort in descending order by index (newest first)
  const entries = files
    .map((file, index) => ({ ...file, index, day: index === 0 ? 1 : index }))
    .sort((a, b) => (a.slug > b.slug ? -1 : 1));
  return { entries, startDate: '2022-03-05' };
};

function getReadableDate(dateStr: string, index: number): string {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
  const datePlusIndex = new Date(date.getTime() + (index - 1) * 24 * 60 * 60 * 1000);
  return datePlusIndex.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getISODate(dateStr: string, index: number): string {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day));
  const datePlusIndex = new Date(date.getTime() + (index - 1) * 24 * 60 * 60 * 1000);
  return datePlusIndex.toISOString();
}

const HundredDaysOfCodePage = () => {
  const { entries, startDate } = useLoaderData<LoaderData>();

  return (
    <section className="flex flex-col gap-20">
      <PageHeading className="font-gamified">100 Days of Code</PageHeading>
      {entries.map(({ frontmatter, markdown, slug, index, day }) => (
        <article className="flex flex-col gap-3" key={slug}>
          <SectionHeading className="w-full flex flex-col lg:flex-row flex-nowrap font-gamified">
            <span>{`Day ${index} of 100`}</span>
            <time className="lg:ml-auto" dateTime={getISODate(startDate, day)}>
              {getReadableDate(startDate, day)}
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
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default HundredDaysOfCodePage;
