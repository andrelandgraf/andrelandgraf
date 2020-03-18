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
    color: ${styles.colors.linkColor};
    text-decoration: none;
  }
 
  h1 {
    font-size: ${styles.fontSizes.xxl};
    font-weight: ${styles.fontWeights.heavy};
    margin: 20px 0;

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
        margin: 10px 0;
    }
  }

  h2 {
    font-size: ${styles.fontSizes.xl};
    font-weight: ${styles.fontWeights.medium};
    margin: 20px 0;

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
        margin: 15px 0;
    }
  }

  h3 {
    @extend h2;
    font-size: 42px;
    font-weight: ${styles.fontWeights.bold};

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
        font-size: 32px;
    }
  }

  p {
    hyphens: none;
    line-height: 1.5;
  }

  p.limit {
    max-width: 890px;
    text-align: justify;
  }

  button {
    border: none;
    box-shadow: none;
    font-size: 0.8rem;
    height: 3rem;
    margin: 0 0 10px 0;
    outline: none;
    padding: 0;
    transition: all 0.3s;
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
