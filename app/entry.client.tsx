import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import { startTransition, StrictMode, useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { getClientEnvVars } from './modules/config/env';

async function initSentry() {
  const { env } = getClientEnvVars();
  const Sentry = await import('@sentry/remix');
  Sentry.init({
    dsn: 'https://020aa2228a95a91776db532a05b75c55@o4504234754899968.ingest.sentry.io/4506177521188864',
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    enabled: env === 'production',

    integrations: [
      Sentry.browserTracingIntegration({
        useEffect,
        useLocation,
        useMatches,
      }),
      // Replay is only available in the client
      Sentry.replayIntegration(),
    ],
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});

initSentry();
