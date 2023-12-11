import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import { startTransition, StrictMode, useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { getClientEnvVars } from './modules/config/env';

async function initSentry() {
  const { env } = getClientEnvVars();
  const { BrowserTracing, init, remixRouterInstrumentation, Replay } = await import('@sentry/remix');
  init({
    dsn: 'https://020aa2228a95a91776db532a05b75c55@o4504234754899968.ingest.sentry.io/4506177521188864',
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    enabled: env === 'production',

    integrations: [
      new BrowserTracing({
        routingInstrumentation: remixRouterInstrumentation(useEffect, useLocation, useMatches),
      }),
      new Replay(),
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
