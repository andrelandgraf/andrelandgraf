import * as Sentry from '@sentry/nextjs';
import { observabilityConfig } from './src/lib/observability/config.ts';

const dsn = observabilityConfig.server.sentryDsn;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}
