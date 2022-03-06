import invariant from 'tiny-invariant';

type PrivateEnvVars = {
  githubAccessToken: string;
  githubRepoAPIUrl: string;
};

function getPrivateEnvVars(): PrivateEnvVars {
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
  const githubRepoAPIUrl = 'https://api.github.com/repos/andrelandgraf/andrelandgraf/contents';
  invariant(githubAccessToken && typeof githubAccessToken === 'string', 'Github access token is not defined');
  return {
    githubAccessToken,
    githubRepoAPIUrl,
  };
}

export { getPrivateEnvVars };
