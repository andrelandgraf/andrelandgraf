import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div` 
  display: flex;
  flex-direction: column;
`;

const Experience = ({
  title, description, fromTo, duration, location, company,
}) => (
  <Container>
    <h4>{`${title} @ ${company}`}</h4>
    <p>{`${fromTo} (${duration})`}</p>
    <p>{location}</p>
    <p>{description}</p>
  </Container>
);

Experience.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  fromTo: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
};

export default Experience;
