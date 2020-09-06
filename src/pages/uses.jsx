import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import DataListInput from 'react-plain-datalist-input';

import '../utilities/logger';

import styles from '../enums/styles';
import Layout from '../components/layout/layout';

const Navigation = styled.nav`
  display: flex;
  flex-direction: row;
  flex-align: flex-start;
  margin-bottom: 4vh;

  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    flex-direction: column;
  }
`;

const Header = styled.div`
  margin-right: auto;
`;

const Search = styled.div`
  width: 25vw;
  min-width: 300px;
  max-width: 600px;
  margin-bottom: 6vh;
  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    width: 90vw;
    margin-bottom: 3vh;
  }

  // copy pasted from react-datalist-input
  .datalist-input {
    /*the container must be positioned relative:*/
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .datalist-input .autocomplete-input {
    width: 100%;
  }

  .datalist-input .datalist-items {
    position: absolute;
    z-index: 99;
    /*position the autocomplete items to be the same width as the container:*/
    top: 100%;
    left: 0;
    right: 0;
  }

  .datalist-input .default-datalist-items {
    border: 1px solid #d4d4d4;
    border-bottom: none;
    border-top: none;
  }

  .datalist-input .default-datalist-items div:not(.datalist-active-item) {
    padding: 10px;
    cursor: pointer;
    background-color: ${styles.colors.backgroundColor};
    border-bottom: 1px solid #d4d4d4;
  }

  .datalist-input .default-datalist-items div:not(.datalist-active-item):hover {
    /*when hovering an item:*/
    background-color: ${styles.colors.backgroundColor};
  }

  .datalist-input .datalist-active-item {
    /*when navigating through the items using the arrow keys:*/
    cursor: pointer;
  }

  .datalist-input .datalist-active-item-default {
    background-color: ${styles.colors.linkColor};
    color: #ffffff;
    border-bottom: 1px solid #d4d4d4;
    padding: 10px;
  }
`;

const ThingsContainer = styled.main`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  @media screen and (max-width: ${styles.widths.phoneWidth}) {
    flex-direction: column;
  }
  @media screen and (min-width: ${styles.widths.pcWidth}) {
    max-width: 800px;
  }
`;

const Thing = styled.div`
  border-radius: 10px;
  text-align: center;
  min-width: 120px;
  margin: 10px;
  padding: 5px;
  border: 1px solid ${props => props.theme};
`;

const tags = {
  framework: 'framework/libary',
  app: 'application/service',
  os: 'operation system',
  cloud: 'cloud platform',
  language: 'language',
  database: 'database',
  entertainment: 'entertainment',
  management: 'task management',
};

const things = [
  {
    name: 'Gatsby',
    tags: [tags.framework],
    theme: '#663399',
    src: '',
  },
  {
    name: 'React',
    tags: [tags.framework],
    theme: '#61dafb',
    src: '',
  },
  {
    name: 'Javascript',
    tags: [tags.language],
    theme: '#FFCD3A',
    src: '',
  },
  {
    name: 'CSS',
    tags: [tags.language],
    theme: '#2965f1',
    src: '',
  },
  {
    name: 'HTML',
    tags: [tags.language],
    theme: '#E44D26',
    src: '',
  },
  {
    name: 'node.js',
    tags: [tags.language],
    theme: '#43853d',
    src: '',
  },
  {
    name: 'express',
    tags: [tags.framework],
    theme: '#eee',
    src: '',
  },
  {
    name: 'mongoose',
    tags: [tags.framework],
    theme: '#800',
    src: '',
  },
  {
    name: 'MongoDB',
    tags: [tags.database],
    theme: '#13aa52',
    src: '',
  },
  {
    name: 'MongoDB Atlas',
    tags: [tags.app],
    theme: '#13aa52',
    src: '',
  },
  {
    name: 'AWS',
    tags: [tags.cloud],
    theme: '#e76d0c',
    src: '',
  },
  {
    name: 'Netlify',
    tags: [tags.cloud],
    theme: '#00ad9f',
    src: '',
  },
  {
    name: 'Logrocket',
    tags: [tags.app],
    theme: '#764ABC',
    src: '',
  },
  {
    name: 'Eslint',
    tags: [tags.framework],
    theme: '#3a33d1',
    src: '',
  },
  {
    name: 'SASS',
    tags: [tags.framework],
    theme: '#BF406F',
    src: '',
  },
  {
    name: 'styled-components',
    tags: [tags.framework],
    theme: '#db7093',
    src: '',
  },
  {
    name: 'lodash',
    tags: [tags.framework],
    theme: '#3492ff',
    src: '',
  },
  {
    name: 'git',
    tags: [tags.management],
    theme: '#f14e32',
    src: '',
  },
  {
    name: 'GitHub',
    tags: [tags.app, tags.management],
    theme: '#24292e',
    src: '',
  },
  {
    name: 'Heroku',
    tags: [tags.cloud],
    theme: '#79589F',
    src: '',
  },
  {
    name: 'Papertrail',
    tags: [tags.app],
    theme: '#04498F',
    src: '',
  },
  {
    name: 'Webpack',
    tags: [],
    theme: '#8dd6f9',
    src: '',
  },
  {
    name: 'Jest',
    tags: [tags.framework],
    theme: '#c21325',
    src: '',
  },
  {
    name: 'Syntax.fm',
    tags: [tags.entertainment],
    theme: '#f1c15d',
    src: '',
  },
  {
    name: 'Dialogflow',
    tags: [tags.app],
    theme: '#ef6c00',
    src: '',
  },
  {
    name: 'Twilio',
    tags: [tags.app],
    theme: '#f22f46',
    src: '',
  },
  {
    name: 'Sendgrid',
    tags: [tags.app],
    theme: '#3368fa',
    src: '',
  },
  {
    name: 'Stripe',
    tags: [tags.app],
    theme: '#6772e5',
    src: '',
  },
  {
    name: 'MacOS',
    tags: [tags.os],
    theme: '#7d7d7d',
    src: '',
  },
  {
    name: 'Android',
    tags: [tags.os],
    theme: '#3ddc84',
    src: '',
  },
  {
    name: 'Trello',
    tags: [tags.management],
    theme: '#0079bf',
    src: '',
  },
];

const UsesPage = () => {
  const [filteredThings, setFilteredThings] = useState(things);

  const handleSelect = useCallback(selectedItem => {
    if (selectedItem) {
      setFilteredThings([selectedItem]);
    } else {
      setFilteredThings(things);
    }
  }, []);

  const handleInput = useCallback(currentInput => {
    if (!currentInput) {
      setFilteredThings(things);
    }
  }, []);

  return (
    <Layout>
      <Navigation>
        <Header>
          <h1>Andre Landgraf Uses</h1>
        </Header>
        <a href="/">Checkout my CV</a>
      </Navigation>
      <Search>
        <DataListInput
          placeholder="Search for a thing..."
          items={things.map(thing => ({
            label: thing.name,
            key: thing.name,
            ...thing,
          }))}
          onSelect={handleSelect}
          requiredInputLength={1}
          onInput={handleInput}
        />
      </Search>
      <ThingsContainer>
        {filteredThings.map(thing => (
          <Thing theme={thing.theme} key={thing.name}>
            <h2>{thing.name}</h2>
          </Thing>
        ))}
      </ThingsContainer>
    </Layout>
  );
};

export default UsesPage;
