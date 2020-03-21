import React from 'react';
import styled from 'styled-components';

import styles from '../../enums/styles';
import ArrowDown from '../../assets/svg/download.svg';

const ButtonLike = styled.div`
    padding: 2px 5px;
    border: 1px solid transparent;
    border-radius: 10px;
    border-color: ${styles.colors.fontColor};

    display: inline-flex;
    flex-direction: row;
    align-items: center;

    white-space: nowrap;
    text-align: center;
    touch-action: manipulation;

    &:hover {
      cursor: pointer;
      color: ${styles.colors.fontColor};
    }

    &:active {
      outline: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
    }

    &:focus {
        background-image: none;
        outline: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
`;

const DownloadButton = () => (
  <a href={`${process.env.GATSBY_AWS_S3}/cv.pdf`} download="andre_landgraf.pdf" target="_blank" rel="noopener noreferrer">
    <ButtonLike>
      <ArrowDown />
      Download CV
    </ButtonLike>
  </a>
);

export default DownloadButton;
