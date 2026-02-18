import * as Sentry from '@sentry/nextjs';
import { observabilityConfig } from './app/modules/config/observability.ts';

const dsn = observabilityConfig.server.sentryDsn;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}
