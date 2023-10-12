import type { MetaFunction } from '@remix-run/node';

import { ButtonLink } from '~/components/buttons';
import { PageHeading, SectionHeading } from '~/components/headings';
import { StyledLink } from '~/components/links';
import { getMetaTags } from '~/utilities/metaTags';

export const config = { runtime: 'edge' };

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'Tutoring',
    description: 'I tutor aspiring web developers every Monday at 6pm PST. Join us!',
  });
};

export default function TutoringPage() {
  return (
    <div className="flex flex-col gap-10 w-full max-w-2xl">
      <PageHeading>Tutoring</PageHeading>
      <p>
        By chance, I got in contact with a lovely crowd of{' '}
        <StyledLink to="https://leonnoel.com/100devs/">100Devs bootcamp</StyledLink> students on Twitter. After a few
        weeks of coffee chats, I started giving recurring Zoom-based tutoring sessions. This led to All Things Web.
      </p>
      <div className="flex flex-col gap-5">
        <SectionHeading>All Things Web - React and HTML, CSS, JavaScript Tutoring</SectionHeading>
        <p>
          I am organizing a weekly/bi-weekly live tutoring session called{' '}
          <span className="text-primary">&quot;All Things Web - React and HTML, CSS, JavaScript Tutoring&quot;</span> on{' '}
          <StyledLink to="https://www.meetup.com/all-things-web-react-html-css-javascript-tutoring/">
            Meetup.com
          </StyledLink>
        </p>
      </div>
      <ButtonLink to="https://www.meetup.com/all-things-web-react-html-css-javascript-tutoring/" primary>
        Join the Meetup Group
      </ButtonLink>
    </div>
  );
}
