import type { MetaFunction } from 'remix';
import { ButtonLink } from '~/components/UI/buttons';
import { PageHeading, SectionHeading } from '~/components/UI/headings';
import { StyledLink } from '~/components/UI/links';

export const meta: MetaFunction = () => {
  return {
    title: 'Tutoring',
    description:
      'Hello World! This is my personal website. Check out my resume and the tech stacks that I develop with.',
  };
};

const TutoringPage = () => {
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
};

export default TutoringPage;
