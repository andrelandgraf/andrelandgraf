import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div` 
  display: flex;
  flex-direction: row;
`;

const Title = styled.h3`

`;

const Company = styled.h4`

`;

const Time = styled.p`
  margin-left: auto;
  display: inline-flex;
  flex-direction: column;
  text-align: right;
`;

const Experience = ({
  title, description, fromTo, duration, location, company,
}) => (
  <Container>
    <div>
      <Title>{title}</Title>
      <Company>{`@ ${company} in ${location}`}</Company>
      <p>{description}</p>
    </div>
    <Time>
      {fromTo}
      <span>{duration}</span>
    </Time>
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
