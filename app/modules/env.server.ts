import invariant from 'tiny-invariant';

function enforceInProd(variable: string | undefined, variableName: string) {
  const isProduction = environment === 'production';
  if (isProduction) {
    invariant(variable, `${variableName} env variable is required.`);
  } else if (!variable) {
    console.warn(`${variableName} env variable is not set.`);
  }
}

const environment = process.env.NODE_ENV;
invariant(environment, 'NODE_ENV env variable is required');

const origin = process.env.ORIGIN;
invariant(origin, 'ORIGIN env variable is required');

const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
invariant(githubAccessToken, 'GITHUB_ACCESS_TOKEN env variable is required');
const githubRepoURI = process.env.GITHUB_REPO_URI;
invariant(githubRepoURI, 'GITHUB_REPO_URI env variable is required');

const openAIApiKey = process.env.OPEN_AI_KEY;
invariant(openAIApiKey, 'OPEN_AI_KEY env variable is required');

const databaseConnectionStr = process.env.DATABASE_URL;
invariant(databaseConnectionStr, 'DATABASE_URL env variable is required');

const sentryDsn = process.env.SENTRY_DSN;
if(!sentryDsn) {
  console.warn('SENTRY_DSN env variable is not set');
}
enforceInProd(process.env.SENTRY_ORG, 'SENTRY_ORG');
enforceInProd(process.env.SENTRY_PROJECT, 'SENTRY_PROJECT');
enforceInProd(process.env.SENTRY_AUTH_TOKEN, 'SENTRY_AUTH_TOKEN');

const posthogPublicAPIKey = process.env.POSTHOG_PUBLIC_API_KEY;
if (!posthogPublicAPIKey) {
  console.warn('POSTHOG_PUBLIC_API_KEY env variable is not set');
}

export const env = {
  environment,
  posthogPublicAPIKey,
  server: {
    origin,
    readContentFrom: 'production',
  },
  github: {
    accessToken: githubAccessToken,
    repoURI: githubRepoURI,
  },
  sentry: {
    dsn: sentryDsn,
  },
  openAI: {
    apiKey: openAIApiKey,
  },
  databaseConnectionStr,
};
