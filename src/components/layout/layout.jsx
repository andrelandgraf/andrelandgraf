import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

import styles from '../../enums/styles';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    background-color: ${styles.colors.backgroundColor};
    margin: 0;
    font-family: ${styles.fonts.default};
    font-size: ${styles.fontSizes.m}
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: ${styles.fonts.code};
  }

  section {
    min-height: 400px;
  }

  a {
    padding: 0;
    font-size: ${styles.fontSizes.m};
    color: ${styles.colors.linkColor};
    text-decoration: none;
  }
 
  h1 {
    font-size: ${styles.fontSizes.xxl};
    font-weight: ${styles.fontWeights.heavy};
    margin: 0 0 10px 0;

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
      font-size: ${styles.fontSizes.xl};
        margin: 10px 0;
        max-width: 90vw;
    }
  }

  h2 {
    font-size: ${styles.fontSizes.xl};
    font-weight: ${styles.fontWeights.medium};
    margin: 20px 0;

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
        margin: 15px 0;
        max-width: 90vw;
    }
  }

  h3 {
    margin: 10px 0;
    font-size: ${styles.fontSizes.m};
    font-weight: ${styles.fontWeights.bold};
    max-width: 50vw;

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
        max-width: 90vw;
    }
  }

  h4 {
    margin: 0;
    font-size: ${styles.fontSizes.m};
    font-weight: ${styles.fontWeights.medium};
    max-width: 50vw;

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
      max-width: 90vw;
    }
  }

  p span i {
    hyphens: none;
    line-height: 1.5;
    font-size: ${styles.fontSizes.m};
    max-width: 50vw;

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
      max-width: 90vw;
    }
  }
`;

const Page = styled.div`
    position: relative;
    width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
`;

const Layout = ({ children }) => (
  <Page>
    <GlobalStyle />
    {children}
  </Page>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(
      PropTypes.node,
    ),
  ]).isRequired,
};

export default Layout;
