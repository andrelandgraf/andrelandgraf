import { Link } from '@remix-run/react';

import { ButtonLink } from '~/components/buttons';
import { PageHeading } from '~/components/headings';
import { Tags } from '~/components/tags';
import { useBlogContent } from '~/modules/blog/hooks';
import { getFocusClasses } from '~/utilities/ariaClasses';
import { getISODate, getReadableDate } from '~/utilities/dates';

export default function Component() {
  const { entries } = useBlogContent();

  return (
    <ul className="w-full lg:max-w-3xl wide:max-w-5xl flex flex-col gap-10" title="Articles">
      {entries.map(({ frontmatter, slug }) => (
        <li key={slug}>
          <article className="flex flex-col gap-3 w-full">
            <Link to={`/blog/${slug}`} prefetch="intent" className={getFocusClasses(true)}>
              <PageHeading asH2 className="text-primaryDark dark:text-primary font-bold">
                {frontmatter.title}
              </PageHeading>
            </Link>
            <h3>
              <time dateTime={getISODate(frontmatter.date)}>{getReadableDate(frontmatter.date)}</time>
            </h3>
            <Tags tags={frontmatter.categories} />
            <p>{frontmatter.description}</p>
            <ButtonLink to={`/blog/${slug}`} aria-label={`View Article ${frontmatter.title}`} prefetch="intent">
              View Article
            </ButtonLink>
          </article>
        </li>
      ))}
    </ul>
  );
}
