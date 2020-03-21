import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1vh;
`;

const Text = styled.h2`
    margin-left: 20px;
`;

const Header = ({ title, icon }) => (
  <Container>
    {icon}
    <Text>{title}</Text>
  </Container>
);

Header.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
