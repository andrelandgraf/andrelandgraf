import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import styled, { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';

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

  p {
    hyphens: none;
    line-height: 1.5;
    font-size: ${styles.fontSizes.m};
    max-width: 500px;

    @media screen and (max-width: ${styles.widths.phoneWidth}) {
      max-width: 90vw;
    }
  }

  ul {
    margin: 0;
    padding-inline-start: 20px;
  }

  li {
    line-height: 1.5;
    font-size: ${styles.fontSizes.m};
    margin: 10px 0;
    max-width: 500px;
    @media screen and (max-width: ${styles.widths.phoneWidth}) {
      max-width: 90vw;
    }
  }

  img {
    border-radius: 10px;
  }

  input {
    border-radius: 5px;
    padding: 10px;
  }
  
  input:focus {
    outline: none;
  }
`;

const Page = styled.div`
    position: relative;
    width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
`;

const Content = styled.div`
  width: 90vw;
  max-width: 2000px;
  overflow-x: hidden;
  margin: 5vh auto 15% auto;
`;

const Layout = ({ children }) => {
  const query = graphql`
  query SEO {
    site {
      siteMetadata {
        title
        description
        image
      }
    }
  }
`;
  const { site: { siteMetadata: { title, description, image } } } = useStaticQuery(query);

  return (
    <Page>
      <Helmet>
        <html lang="en" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="description"
          content={description}
        />
        <meta name="image" content={image} />
        <title>{title}</title>
      </Helmet>
      <GlobalStyle />
      <Content>
        {children}
      </Content>
    </Page>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(
      PropTypes.node,
    ),
  ]).isRequired,
};

export default Layout;
