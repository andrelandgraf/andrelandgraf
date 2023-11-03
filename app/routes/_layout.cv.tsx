import type { LinksFunction, MetaFunction } from '@remix-run/node';

import { PageHeading, SectionHeadingWithIcon } from '~/components/headings';
import { CollegeSvg, GroupSvg, RocketSvg } from '~/components/icons';
import { StyledLink } from '~/components/links';
import resumeStylesUrl from '~/styles/resume.css';
import { getMetaTags } from '~/utilities/metaTags';

export const config = { runtime: 'edge' };

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: resumeStylesUrl }];
};

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'Resume',
    description:
      'Hello World! This is my personal website. Check out my resume and the tech stacks that I develop with.',
  });
};

const experiences = [
  <Experience
    key="LinkedIn"
    title="Software Engineer (frontend)"
    description="Part of the advertiser productivity team, improving the user experience for advertisers on LinkedIn's Campaign Manager platform."
    fromTo="06/2022 – today"
    location="Sunnyvale, CA, USA"
    company="LinkedIn"
  />,
  <Experience
    key="MBRDNA"
    title="Software Engineer (external)"
    description="Design and implementation of HeyMercedes voice applications. Development of internal fullstack software solutions such as SDKs, admin panels, and more to enable customer personalization features."
    fromTo="11/2020 – 08/2021"
    location="Remote"
    company="Mercedes-Benz Research & Development Nothern America"
  />,
  <Experience
    key="MBRDNA Intern"
    title="Software Engineering Intern"
    description="Design and implementation of HeyMercedes voice applications. Full rewrite and maintenance of the Mercedes ME Action on Google."
    fromTo="11/2019 – 11/2020"
    location="Sunnyvale, CA, USA"
    company="Mercedes-Benz Research & Development Nothern America"
  />,
  <Experience
    key="Netlight"
    title="Software Engineering Working Student"
    description="Part of an international Scrum team. Developing the internal knowledge management software in React, HTML5, SCSS, and Drupal."
    fromTo="01/2019 – 09/2019"
    location="Munich, Germany"
    company="Netlight"
  />,
  <Experience
    key="qSkills"
    title="Software Engineering Working Student"
    description="Implementation of multiple features for the internal web based business software in PHP, MySQL, HTML5/CSS3, and JS. Developed a user interface and backend service to synchronize data with the companies’ active directory."
    fromTo="02/2017 – 09/2018"
    location="Nuremberg, Germany"
    company="qSkills"
  />,
  <Experience
    key="DATEV"
    title="Quality Assurance Working Student"
    description="Support activities to reorganize the product backlog to meet Scrum based requirements. I worked on quality assurance, reverse engineering, and manual testing activities such as creating new test cases."
    fromTo="02/2016 -06/2016"
    location="Nuremberg, Germany"
    company="DATEV"
  />,
];

const projects = [
  <Project
    key="VelaPilates"
    title="Vela Pilates"
    link="https://velapilates.de/"
    description="An online pilates studio and course purchasing web app powered by Gatsby.js, Express, MongoDB."
  />,
  <Project
    key="react-datalist-input"
    title="react-datalist-input"
    link="https://www.npmjs.com/package/react-datalist-input"
    description="An npm package that provides a single React component. It contains an input field with a drop down menu to pick a possible option based on the current input."
  />,
  <Project
    key="react-ssml-dom"
    title="react-ssml-dom"
    link="https://www.npmjs.com/package/react-ssml-dom"
    description="An npm package that provides a React renderer for voice applications. react-ssml-dom is a research project that aims to take advantage of React and its component-based UI development for voice UIs. It also provides a middleware engine to parse any request from any vendor to a unified runtime payload and then revert back the response to the vendor-based response JSON."
  />,
];

const educations = [
  <Education
    key="Sofia"
    univeristy="Sofia University"
    degree="Master of Science"
    major="Computer Science"
    fromTo="2021 - 2022"
    location="Palo Alto, CA, USA"
  />,
  <Education
    key="TUM"
    univeristy="Technical University of Munich (TUM)"
    degree="Master of Science"
    major="Information Systems"
    fromTo="2017 - 2021"
    location="Munich, Germany"
  />,
  <Education
    key="Stanford"
    univeristy="Stanford University"
    degree="Certificate (Continuing Studies)"
    major="The Frontiers of AI Research and Applications"
    fromTo="Five Weeks"
    location="Stanford, CA, USA"
  />,
  <Education
    key="RMIT"
    univeristy="Royale Melbourne Institue of Technology (RMIT)"
    degree="Semester abroad"
    major="Information Systems"
    fromTo="One Semester"
    location="Melbourne, Australia"
  />,
  <Education
    key="FAU"
    univeristy="Friedrich-Alexander-Universitiy Erlangen-Nuremberg (FAU)"
    degree="Bachelor of Science"
    major="Information Systems"
    fromTo="2014 - 2017"
    location="Nuremberg, Germany"
  />,
];

export default function Component() {
  return (
    <main className="flex flex-col gap-10 lg:gap-16 w-full lg:max-w-5xl">
      <PageHeading>Resume</PageHeading>
      <section className="w-full flex flex-col gap-5 lg:gap-8">
        <SectionHeadingWithIcon id="experience" icon={<GroupSvg />}>
          Working Experience
        </SectionHeadingWithIcon>
        {experiences}
      </section>
      <section className="w-full flex flex-col gap-8">
        <SectionHeadingWithIcon id="projects" icon={<RocketSvg />}>
          Selected Projects
        </SectionHeadingWithIcon>
        {projects}
      </section>
      <section className="w-full flex flex-col gap-8">
        <SectionHeadingWithIcon id="education" icon={<CollegeSvg />}>
          Education
        </SectionHeadingWithIcon>
        {educations}
      </section>
    </main>
  );
}

type EducationProps = {
  univeristy: string;
  degree: string;
  major: string;
  fromTo: string;
  location: string;
};

function Education({ univeristy, degree, major, fromTo, location }: EducationProps) {
  return (
    <div className="w-full flex flex-col-reverse lg:flex-row gap-2 lg:gap-0">
      <div className="flex flex-col gap-1 lg:gap-2">
        <h3>{univeristy}</h3>
        <h4 className="flex flex-col gap-1 lg:gap-2">
          <span className="text-xl xl:text-2xl font-semibold">{degree}</span>
          <i className="font-medium">{major}</i>
        </h4>
      </div>
      <p className="flex flex-col gap-1 font-light lg:gap-2 lg:ml-auto lg:text-right lg:items-end">
        <span>{fromTo}</span>
        <i>{location}</i>
      </p>
    </div>
  );
}

type ExperienceProps = {
  title: string;
  description: string;
  fromTo: string;
  location: string;
  company: string;
};

function Experience({ title, description, fromTo, location, company }: ExperienceProps) {
  return (
    <div className="w-full flex flex-col-reverse lg:flex-row gap-1 lg:gap-0">
      <div className="flex flex-col gap-1 lg:gap-2">
        <h3 className="text-xl xl:text-2xl font-semibold">{title}</h3>
        <h4 className="font-semibold">{company}</h4>
        <p className="leading-relaxed max-w-2xl">{description}</p>
      </div>
      <p className="flex flex-col gap-1 font-light lg:gap-2 lg:ml-auto lg:text-right lg:items-end">
        <span>{fromTo}</span>
        <i>{location}</i>
      </p>
    </div>
  );
}

type ProjectProps = {
  title: string;
  description: string;
  link: string;
};

function Project({ title, description, link }: ProjectProps) {
  return (
    <div className="flex flex-col gap-1 lg:gap-2">
      <h3 className="text-xl xl:text-2xl font-semibold">{title}</h3>
      <div>
        <StyledLink to={link}>Visit Project</StyledLink>
      </div>
      <p className="leading-relaxed max-w-2xl">{description}</p>
    </div>
  );
}
