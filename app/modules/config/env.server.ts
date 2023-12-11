import dotenv from 'dotenv';
import invariant from 'tiny-invariant';

import type { PrivateEnvVars, PublicEnvVars } from './types';

dotenv.config();

export function getPublicEnvVars(): PublicEnvVars {
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  return {
    env,
  };
}

const DEV_FETCH_FROM = 'production';

export function getPrivateEnvVars(): PrivateEnvVars {
  const readContentFrom = process.env.NODE_ENV === 'production' ? 'production' : DEV_FETCH_FROM;
  const databaseUrl = process.env.DATABASE_URL;
  invariant(databaseUrl && typeof databaseUrl === 'string', 'Database URL is not defined');
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
  const githubRepoAPIUrl = 'https://api.github.com/repos/andrelandgraf/andrelandgraf/contents';
  invariant(githubAccessToken && typeof githubAccessToken === 'string', 'Github access token is not defined');
  const openAIKey = process.env.OPEN_AI_KEY;
  invariant(openAIKey && typeof openAIKey === 'string', 'Open AI key is not defined');
  return {
    ...getPublicEnvVars(),
    databaseUrl,
    githubAccessToken,
    githubRepoAPIUrl,
    readContentFrom,
    openAIKey,
  };
}
