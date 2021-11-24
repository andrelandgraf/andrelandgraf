import type { MetaFunction, HeadersFunction } from 'remix';

export const headers: HeadersFunction = () => {
  const headers = new Headers();
  headers.set('Cache-Control', 'public, max-age=3600');
  return headers;
};

export const meta: MetaFunction = () => {
  return {
    title: 'USES TECH | Andre Landgraf',
    description: 'Hello World! This is my personal website. Check out my CV and the tech stacks that I develop with.',
    'Cache-Control': 'public, max-age=3600',
  };
};

const tags = {
  framework: 'framework/libary',
  app: 'application/service',
  os: 'operation system',
  cloud: 'cloud platform',
  language: 'language',
  database: 'database',
  entertainment: 'entertainment',
  management: 'task management',
  styling: 'styling',
};

const things = [
  {
    name: 'Remix',
    tags: [tags.framework],
    theme: 'black',
    src: 'https://remix.run/',
  },
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
    name: 'TypeScript',
    tags: [tags.language],
    theme: '#3178C6',
    src: 'https://www.typescriptlang.org/',
  },
  {
    name: 'JavaScript',
    tags: [tags.language],
    theme: '#FFCD3A',
    src: '',
  },
  {
    name: 'CSS',
    tags: [tags.language, tags.styling],
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
    name: 'tailwindcss',
    tags: [tags.framework, tags.styling],
    theme: '#0ea5e9',
    src: 'https://tailwindcss.com/',
  },
  {
    name: 'SASS',
    tags: [tags.framework, tags.styling],
    theme: '#BF406F',
    src: '',
  },
  {
    name: 'styled-components',
    tags: [tags.framework, tags.styling],
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
  {
    name: 'Next.js',
    tags: [tags.framework],
    theme: '#000',
    src: '',
  },
];

const UsesPage = () => {
  return (
    <div>
      <ul className="rounded-md flex flex-col lg:flex-row lg:flex-wrap gap-10 p-10 dark:bg-gray-800">
        {things.map((thing) => (
          <li className="flex gap-2 text-xl xl:text-2xl font-semibold" key={thing.name}>
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: thing.theme }}></div>
            {thing.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsesPage;
