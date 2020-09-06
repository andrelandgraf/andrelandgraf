import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import styles from '../../enums/styles';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1vh;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    margin-bottom: 3vh;
    flex-direction: column-reverse;
  }
`;

const TimeLocation = styled.p`
  margin-left: auto;
  text-align: right;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    margin-left: 0;
    flex-direction: row;
    align-items: flex-start;
  }
`;

const Location = styled.span`
  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    margin-left: auto;
    padding-right: 2px;
  }
`;

const Degree = styled.h4`
  margin: 10px 0;
`;

const Education = ({ univeristy, degree, major, fromTo, location }) => (
  <Container>
    <div>
      <h3>{univeristy}</h3>
      <Degree>{degree}</Degree>
      <h4>
        <i>{major}</i>
      </h4>
    </div>
    <TimeLocation>
      <span>{fromTo}</span>
      <Location>
        <i>{location}</i>
      </Location>
    </TimeLocation>
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
