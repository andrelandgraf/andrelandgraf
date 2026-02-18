import * as Sentry from '@sentry/nextjs';
import { observabilityConfig } from './app/modules/config/observability.ts';

const dsn = observabilityConfig.public.sentryPublicDsn;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
