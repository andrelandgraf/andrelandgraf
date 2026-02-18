import { configSchema, pub, server } from './schema.ts';

export const observabilityConfig = configSchema('Observability', {
  sentryDsn: server({
    env: 'SENTRY_DSN',
    optional: true,
  }),
  sentryPublicDsn: pub({
    env: 'NEXT_PUBLIC_SENTRY_DSN',
    value: process.env.NEXT_PUBLIC_SENTRY_DSN,
    optional: true,
  }),
  sentryOrg: server({
    env: 'SENTRY_ORG',
    optional: true,
  }),
  sentryProject: server({
    env: 'SENTRY_PROJECT',
    optional: true,
  }),
  sentryAuthToken: server({
    env: 'SENTRY_AUTH_TOKEN',
    optional: true,
  }),
});
