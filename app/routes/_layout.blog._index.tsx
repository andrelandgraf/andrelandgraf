import { Link } from '@remix-run/react';
import { ButtonLink } from '~/components/buttons/index.tsx';
import { PageHeading } from '~/components/headings.tsx';
import { Tags } from '~/components/tags.tsx';
import { useBlogContent } from '~/modules/blog/hooks.tsx';
import { getFocusClasses } from '~/utilities/ariaClasses.ts';
import { getISODate, getReadableDate } from '~/utilities/dates.ts';

export default function Component() {
  const { entries } = useBlogContent();

  return (
    <ul className="w-full lg:max-w-3xl wide:max-w-5xl flex flex-col gap-10" title="Articles">
      {entries.map((article) => (
        <li key={article.slug}>
          <article className="flex flex-col gap-3 w-full">
            <Link to={`/blog/${article.slug}`} prefetch="intent" className={getFocusClasses(true)}>
              <PageHeading asH2 className="text-primaryDark dark:text-primary font-bold">
                {article.title}
              </PageHeading>
            </Link>
            <h3>
              <time dateTime={getISODate(article.date)}>{getReadableDate(article.date)}</time>
            </h3>
            <Tags tags={article.categories} />
            <p>{article.description}</p>
            <ButtonLink to={`/blog/${article.slug}`} aria-label={`View Article ${article.title}`} prefetch="intent">
              View Article
            </ButtonLink>
          </article>
        </li>
      ))}
    </ul>
  );
}
