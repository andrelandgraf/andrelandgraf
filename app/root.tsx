import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { captureRemixErrorBoundaryError } from '@sentry/remix';
import type { LinksFunction } from '@vercel/remix';

import styles from '~/styles/tailwind.css';

import { EnvMeta } from './modules/config/env';
import { getPublicEnvVars } from './modules/config/env.server';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export function loader() {
  const publicEnvVars = getPublicEnvVars();
  return { publicEnvVars };
}

export default function App() {
  const { publicEnvVars } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <EnvMeta publicEnvVars={publicEnvVars} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return <div>Something went wrong</div>;
}
