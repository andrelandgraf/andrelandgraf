import invariant from 'tiny-invariant';
import { eventsConfig } from './config/events.ts';
import { mainConfig } from './config/main.ts';
import { observabilityConfig } from './config/observability.ts';

function enforceInProd(variable: string | undefined, variableName: string, environment: string) {
  const isProduction = environment === 'production';
  if (isProduction) {
    invariant(variable, `${variableName} env variable is required.`);
  } else if (!variable) {
    console.warn(`${variableName} env variable is not set.`);
  }
}

const environment = mainConfig.server.nodeEnv;
const origin = (mainConfig.server.origin || 'http://localhost:3000').trim();
if (environment === 'production') {
  invariant(mainConfig.server.origin?.trim(), 'ORIGIN env variable is required.');
}

const sentryDsn = observabilityConfig.server.sentryDsn;
if (!sentryDsn) {
  console.warn('SENTRY_DSN env variable is not set');
}
enforceInProd(observabilityConfig.server.sentryOrg, 'SENTRY_ORG', environment);
enforceInProd(observabilityConfig.server.sentryProject, 'SENTRY_PROJECT', environment);
enforceInProd(observabilityConfig.server.sentryAuthToken, 'SENTRY_AUTH_TOKEN', environment);

const posthogPublicAPIKey = mainConfig.server.posthogPublicApiKey;
if (!posthogPublicAPIKey) {
  console.warn('POSTHOG_PUBLIC_API_KEY env variable is not set');
}

if (!eventsConfig.server.lumaApiKey) {
  console.warn('LUMA_API_KEY env variable is not set');
}

export const env = {
  environment,
  posthogPublicAPIKey,
  server: {
    origin,
    readContentFrom: 'production',
  },
  sentry: {
    dsn: sentryDsn,
  },
};
