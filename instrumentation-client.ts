import * as Sentry from '@sentry/nextjs';
import { observabilityConfig } from './src/lib/observability/config.ts';

const dsn = observabilityConfig.public.sentryPublicDsn;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
