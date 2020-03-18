import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div` 
  display: flex;
  flex-direction: column;
`;

const Skills = ({ skills }) => (
  <Container>
    <ul>
      { skills.map((skill) => (
        <li key={skill}>
          {skill}
        </li>
      ))}
    </ul>
  </Container>
);

Skills.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Skills;
