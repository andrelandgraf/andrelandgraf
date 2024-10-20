import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react';
import { captureRemixErrorBoundaryError } from '@sentry/remix';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { requireCanonicalSession } from './modules/session.server.ts';
import { env } from './modules/env.server.ts';
// @ts-ignore comment
import styles from '~/styles/tailwind.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const meta: ReturnType<MetaFunction> = [];
  if (data?.posthogPublicAPIKey) {
    meta.push({ name: 'x-posthog', content: data.posthogPublicAPIKey });
  }
  if (data?.sentryDsn) {
    meta.push({ name: 'x-sentry', content: data.sentryDsn });
  }
  if (data?.appVersion) {
    meta.push({ name: 'x-app-version', content: data.appVersion });
  }
  if (data?.serverOrigin) {
    meta.push({ name: 'x-server-origin', content: data.serverOrigin });
  }
  return meta;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  await requireCanonicalSession(request);
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
  return {
    posthogPublicAPIKey: env.posthogPublicAPIKey,
    sentryDsn: env.sentry.dsn,
    appVersion: context.appVersion,
    serverOrigin: origin,
  };
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return <div>Something went wrong</div>;
}
