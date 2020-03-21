import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import styles from '../../enums/styles';

const Container = styled.div` 
  display: flex;
  flex-direction: row;
  margin-bottom: 3vh;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    margin-bottom: 4vh;
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


const Experience = ({
  title, description, fromTo, location, company,
}) => (
  <Container>
    <div>
      <h3>{title}</h3>
      <h4>{company}</h4>
      <p>{description}</p>
    </div>
    <TimeLocation>
      <span>
        {fromTo}
      </span>
      <Location>
        <i>
          {location}
        </i>
      </Location>
    </TimeLocation>
  </Container>
);

Experience.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  fromTo: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
};

export default Experience;
