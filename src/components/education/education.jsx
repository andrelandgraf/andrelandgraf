import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div` 
  display: flex;
  flex-direction: column;
`;

const Degree = styled.h4`
    max-width: 60vw;
`;

const Education = ({
  univeristy, degree, major, fromTo, location,
}) => (
  <Container>
    <h3>{univeristy}</h3>
    <Degree>
      {degree}
      <i>{` - ${major}`}</i>
    </Degree>
    <p>
      {fromTo}
      {location}
    </p>
  </Container>
);

Education.propTypes = {
  univeristy: PropTypes.string.isRequired,
  degree: PropTypes.string.isRequired,
  major: PropTypes.string.isRequired,
  fromTo: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

export default Education;
