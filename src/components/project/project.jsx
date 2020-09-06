import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Project = ({ title, description, link }) => (
  <Container>
    <a href={link} target="_blank" rel="noopener noreferrer">
      <h3>{title}</h3>
    </a>
    <p>{description}</p>
  </Container>
);

Project.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default Project;
