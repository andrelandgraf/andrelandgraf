import { useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';

import { ButtonLink } from '~/components/buttons';
import { PageHeading, SectionHeading } from '~/components/headings';
import { getMetaTags } from '~/utilities/metaTags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'Homepage',
    description:
      'Hey there, this is my personal website & blog. I use this site to try out new things, share my knowledge, and document my journey. I hope you find something useful here!',
  });
};

export function loader() {
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
  ];
  // mix sections in random order
  const mixedSections = sections.sort(() => Math.random() - 0.5);
  return { mixedSections };
}

export default function Component() {
  const { mixedSections } = useLoaderData<typeof loader>();
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
}
