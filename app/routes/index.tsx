import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ButtonLink } from '~/components/UI/buttons';
import { PageHeading, SectionHeading } from '~/components/UI/headings';
import { getMetaTags } from '~/utilities';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'Homepage',
    description:
      'Hello World! This is my personal website. Check out my resume and the tech stacks that I develop with.',
  });
};

const sections = [
  {
    key: 'projects',
    title: 'Projects',
    description: 'A list of selected projects I have worked on.',
    to: '/cv#projects',
    label: 'View Projects',
  },
  {
    key: 'uses',
    title: 'Tech Stack',
    description: 'The cool tech I am using! #uses',
    to: '/uses',
    label: 'View Tech Stack',
  },
  {
    key: 'demos',
    title: 'Demos',
    description: 'Check out my playground of little demos.',
    to: '/demos',
    label: 'View Demo Playground',
  },
  {
    key: 'tutoring',
    title: 'Tutoring',
    description: 'I tutor web dev in my free time. Interested? Check out our community!',
    to: '/tutoring',
    label: 'View Tutoring Information',
  },
  {
    key: 'blog',
    title: 'Blog',
    description: 'I write blog articles about all things web.',
    to: '/blog',
    label: 'Checkout my blog',
  },
  {
    key: '100daysOfCode',
    title: '100DaysOfCode',
    description: 'I code in public. View my 100 days of code journey.',
    to: '/100-days-of-code',
    label: 'View 100DaysOfCode Journal',
  },
];

type Sections = typeof sections;

export const loader: LoaderFunction = (): Sections => {
  // mix sections in random order
  const mixedSections = sections.sort(() => Math.random() - 0.5);
  return mixedSections;
};

const IndexPage = () => {
  const mixedSections = useLoaderData<Sections>();
  return (
    <div className="flex flex-col gap-5 lg:gap-10 w-full lg:max-w-5xl">
      <PageHeading>Homepage</PageHeading>
      {mixedSections.map((section) => (
        <section
          key={section.key}
          className="p-10 text-black w-full flex flex-col gap-8 bg-primary shadow-md rounded-lg"
        >
          <SectionHeading>{section.title}</SectionHeading>
          <p>{section.description}</p>
          <ButtonLink to={section.to}>&rarr; {section.label}</ButtonLink>
        </section>
      ))}
    </div>
  );
};

export default IndexPage;
