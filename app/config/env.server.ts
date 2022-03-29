import invariant from 'tiny-invariant';

type PrivateEnvVars = {
  readContentFrom: 'locale' | 'production';
  githubAccessToken: string;
  githubRepoAPIUrl: string;
};

const DEV_FETCH_FROM = 'locale';

function getPrivateEnvVars(): PrivateEnvVars {
  const readContentFrom = process.env.NODE_ENV === 'production' ? 'production' : DEV_FETCH_FROM;
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
  const githubRepoAPIUrl = 'https://api.github.com/repos/andrelandgraf/andrelandgraf/contents';
  invariant(githubAccessToken && typeof githubAccessToken === 'string', 'Github access token is not defined');
  return {
    githubAccessToken,
    githubRepoAPIUrl,
    readContentFrom,
  };
}

export { getPrivateEnvVars };
