import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import styled from 'styled-components';

import '../utilities/logger';

import styles from '../enums/styles';
import Layout from '../components/layout/layout';

const Content = styled.div`
  width: 90vw;
  overflow-x: hidden;
  margin: 5vh 5vw 15% 5vw;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    margin-bottom: 15%;
  }
`;

const NotFoundPage = () => {
  useEffect(() => {
    navigate('/');
  });

  return (
    <Layout>
      <Content>
        <h1>Wupsi, this page does not exist!</h1>
      </Content>
    </Layout>
  );
};

export default NotFoundPage;
