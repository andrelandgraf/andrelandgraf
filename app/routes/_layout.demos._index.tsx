import type { MetaFunction } from '@remix-run/node';

import { PageHeading, SectionHeading } from '~/components/headings';
import { StyledLink } from '~/components/links';
import { getMetaTags } from '~/utilities/metaTags';

export const config = { runtime: 'edge' };

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'Demos',
    description: 'A list of smaller demos.',
  });
};

const games = [
  {
    title: 'Jump n Run',
    description: 'My first browser game! A simple game where you can jump and run.',
    href: '/demos/jumpNRun',
  },
];

export default function Component() {
  return (
    <main className="flex flex-col gap-10 lg:gap-16 w-full lg:max-w-5xl">
      <PageHeading>Demos</PageHeading>
      <section className="w-full flex flex-col gap-5 lg:gap-8">
        <SectionHeading>Games</SectionHeading>
        <ul>
          {games.map((game) => (
            <li key={game.href} className="flex flex-col gap-3">
              <h3 className="">{game.title}</h3>
              <p>{game.description}</p>
              <StyledLink to={game.href}>{`>>> To the Game!`}</StyledLink>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
