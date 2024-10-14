import invariant from 'tiny-invariant';
import process from 'node:process';

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

const dbConnectionStr = process.env.DATABASE_URL;
invariant(dbConnectionStr, 'DATABASE_URL env variable is required');

const volumePath = process.env.VOLUME_PATH;
invariant(volumePath, 'VOLUME_PATH env variable is required')

const sentryDsn = process.env.SENTRY_DSN;
if (!sentryDsn) {
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
    volumePath,
  },
  db: {
    path: dbConnectionStr,
  },
  sentry: {
    dsn: sentryDsn,
  },
};
