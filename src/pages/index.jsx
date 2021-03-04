import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import '../utilities/logger';

import styles from '../enums/styles';
import Layout from '../components/layout/layout';
import Experience from '../components/experience/experience';
import Project from '../components/project/project';
import Skills from '../components/skills/skills';
import Education from '../components/education/education';
import Header from '../components/header/header';
import DownloadButton from '../components/download/download';

import College from '../assets/svgs/college.svg';
import Group from '../assets/svgs/group.svg';
import Electron from '../assets/svgs/electron.svg';
import Rocket from '../assets/svgs/rocket.svg';

const Navigation = styled.nav`
  display: flex;
  flex-direction: row;
  flex-align: flex-start;
  margin-bottom: 4vh;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    flex-direction: column;
  }
`;

const Intro = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 50vw;
  margin-right: auto;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    max-width: 90vw;
  }
`;

const IntroText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 45px;
`;

const Portrait = styled.div`
  width: 120px;
  margin-bottom: 10px;
  img {
    border-radius: 10px;
  }
`;

const Curriculum = styled.main`
  max-width: 65vw;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    max-width: 90vw;
  }
`;

const experiences = [
  <Experience
    key="MBRDNA"
    title="Software Engineer (external)"
    description="Design and implementation of HeyMercedes voice applications. Development of internal fullstack software solutions such as SDKs, admin panels, and more to enable customer personalization features."
    fromTo="11/2020 – today"
    location="Remote"
    company="Mercedes-Benz Research & Development Nothern America"
  />,
  <Experience
    key="MBRDNA"
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
    key="PsychologieAlexa"
    title="Alexa, spreche mit Psychologie Landgraf"
    link="https://www.amazon.de/andrelandgraf-Psychologie-f%C3%BCr-Sie/dp/B08X1VTX53/"
    description="A psycho-education Alexa skill that provides answers to common psychological questions and offers guided hypnosis."
  />,
  <Project
    key="Psychologie"
    title="Psychologie für Sie"
    link="https://psychologie-landgraf.de/"
    description="An online psychology studio and course purchasing web app powered by Gatsby.js, Express, MongoDB."
  />,
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
    description="A npm package that provides a single React component. It contains an input field with a drop down menu to pick a possible option based on the current input."
  />,
  <Project
    key="react-ssml-dom"
    title="react-ssml-dom"
    link="https://www.npmjs.com/package/react-ssml-dom"
    description="A npm package that provides a React renderer for voice applications. react-ssml-dom is a research project that aims to take advantage of React and its component-based UI development for voice UIs. It also provides a middleware engine to parse any request from any vendor to a unified runtime payload and then revert back the response to the vendor-based response JSON."
  />,
];

const educations = [
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

const skills = [
  'Fullstack Software Engineering',
  'Web Development',
  'Agile Methologies (Scrum, Kanban)',
  'Design Thinking',
];

const CV = ({ data }) => (
  <Layout>
    <Navigation>
      <Intro>
        <Portrait>
          <GatsbyImage
            image={data.file.childImageSharp.gatsbyImageData}
            alt="Portrait of Andre Landgraf"
          />
        </Portrait>
        <IntroText>
          <h1>Andre Landgraf</h1>
          <p>
            A tech enthusiast and student who loves to develop fullstack
            software solutions.
          </p>
        </IntroText>
      </Intro>
      <DownloadButton />
    </Navigation>
    <Curriculum>
      <Header title="Working Experience" icon={<Group />} />
      {experiences}
      <Header title="Projects" icon={<Rocket />} />
      {projects}
      <Header title="Education" icon={<College />} />
      {educations}
      <Header title="Skills" icon={<Electron />} />
      <Skills skills={skills} />
    </Curriculum>
  </Layout>
);

CV.propTypes = {
  data: PropTypes.shape({
    file: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        gatsbyImageData: PropTypes.oneOfType([
          PropTypes.arrayOf(PropTypes.shape({})),
          PropTypes.shape({}),
        ]),
      }),
    }),
  }).isRequired,
};

export default CV;

export const query = graphql`
  query ImageQuery {
    file(relativePath: { eq: "portrait.jpg" }) {
      childImageSharp {
        gatsbyImageData(width: 480, layout: CONSTRAINED)
      }
    }
  }
`;
