import React from 'react';
import styled from 'styled-components';

import '../utilities/logger';

import styles from '../enums/styles';
import Layout from '../components/layout/layout';
import Experience from '../components/experience/experience';
import Project from '../components/project/project';
import Skills from '../components/skills/skills';
import Education from '../components/education/education';
import Header from '../components/header/header';
import DownloadButton from '../components/download/download';

import College from '../assets/svg/college.svg';
import Group from '../assets/svg/group.svg';
import Electron from '../assets/svg/electron.svg';
import Rocket from '../assets/svg/rocket.svg';


const Content = styled.div`
  width: 90vw;
  overflow-x: hidden;
  margin: 5vh 5vw 15% 5vw;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
      margin-bottom: 15%;
  }
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: row;
  flex-align: flex-start;

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

const Portrait = styled.img`
  height: 120px;
  width: 111px;
  border-radius: 0 10px;
`;

const Curriculum = styled.div`
  max-width: 65vw;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    max-width: 90vw;
  }
`;

const experiences = [
  <Experience
    key="MBRDNA"
    title="Software Engineering Intern"
    description="Designing and implementing voice assistant applications. Developing internal fullstack software solutions."
    fromTo="11/2019 – today"
    duration="5 month"
    location="Sunnyvale, CA, USA"
    company="Mercedes-Benz Research & Development Nothern America"
  />,
  <Experience
    key="Netlight"
    title="Software Engineering Working Student"
    description="Part of an international Scrum team. Developing the internal knowledge management software in React, HTML5, SCSS, and Drupal."
    fromTo="01/2019 – 09/2019"
    duration="9 month"
    location="Munich, Germany"
    company="Netlight"
  />,
  <Experience
    key="qSkills"
    title="Software Engineering Working Student"
    description="Implemented multiple features for the internal web based business software in PHP, MySQL, HTML5/CSS3, and JS. Developed an user interface and backend service to synchronize data with the companies’ active directory."
    fromTo="02/2017 – 09/2018"
    duration="1 year 8 month"
    location="Nuremberg, Germany"
    company="qSkills"
  />,
  <Experience
    key="DATEV"
    title="Quality Assurance Working Student"
    description="Helped my team to reorganize the product backlog to meet Scrum based requirements. Worked on quality assurance, reverse engineering and manual testing activities like creating new test cases."
    fromTo="02/2016 -06/2016"
    duration="5 month"
    location="Nuremberg, Germany"
    company="DATEV"
  />,
];

const projects = [
  <Project
    key="VelaPilates"
    title="VelaPilates"
    link="https://pilates-fitness.studio/"
    description="An online pilates studio and course purchasing webapp powered by Gatsbjs, Express, MongoDB."
  />,
  <Project
    key="react-datalist-input"
    title="react-datalist-input"
    link="https://www.npmjs.com/package/react-datalist-input"
    description="A npm package that provides a single react component. It contains an input field with a drop down menu to pick a possible option based on the current input as a react component."
  />,
];

const educations = [
  <Education
    key="TUM"
    univeristy="Technical University of Munich (TUM)"
    degree="Master of Science"
    major="Information Systems"
    fromTo="2017 - today"
    location="Munich, Germany"
  />,
  <Education
    key="Stanford"
    univeristy="Stanford University"
    degree="Certificate (Continuing Studies)"
    major="The Frontiers of AI Research and Applications"
    fromTo="5 Weeks"
    location="Stanford, CA, USA"
  />,
  <Education
    key="RMIT"
    univeristy="Royale Melbourne Institue of Technology (RMIT)"
    degree="Semester abroad"
    major="Information Systems"
    fromTo="2016"
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

console.log(process.env.GATSBY_AWS_S3);
export default () => (
  <Layout>
    <Content>
      <Navigation>
        <Intro>
          <Portrait src={`${process.env.GATSBY_AWS_S3}/portrait.jpg`} alt="Portrait of Andre Landgraf" />
          <IntroText>
            <h1>Andre Landgraf</h1>
            <p>
              A tech enthusiast and student who loves to develop fullstack software solutions.
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

    </Content>
  </Layout>
);
