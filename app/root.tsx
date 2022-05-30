import * as React from 'react';
import type { LinksFunction, HeadersFunction, MetaFunction, LoaderFunction } from 'remix';
import { useLoaderData } from 'remix';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch, useLocation } from 'remix';
import { IsomorphicNavProvider } from 'react-router-isomorphic-link';
import Layout from '~/components/layout/layout';
import { PageHeading } from '~/components/UI/headings';
import { getMetaTags } from '~/utilities';

import globalStylesUrl from '~/styles/global.css';

/**
 * The `links` export is a function that returns an array of objects that map to
 * the attributes for an HTML `<link>` element. These will load `<link>` tags on
 * every route in the app, but individual routes can include their own links
 * that are automatically unloaded when a user navigates away from the route.
 *
 * https://remix.run/api/app#links
 */
export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: globalStylesUrl }];
};

/**
 * Use Cache-Control for all pages.
 */
export const headers: HeadersFunction = () => {
  const headers = new Headers();
  headers.set('Cache-Control', 'public, max-age=3600');
  return headers;
};

export const meta: MetaFunction = () => {
  return getMetaTags({
    useCatchPhraseInTitle: true,
  });
};

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  return { host: url.host };
};

/**
 * The root module's default export is a component that renders the current
 * route via the `<Outlet />` component. Think of this as the global layout
 * component for your app.
 */
export default function App() {
  const { host } = useLoaderData();
  return (
    <Document>
      <IsomorphicNavProvider host={host} useFinalSlash>
        <AppContent />
      </IsomorphicNavProvider>
    </Document>
  );
}

function AppContent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function Document({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
      break;
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <section className="border-4 border-red-500 p-10">
          <PageHeading>There was an error</PageHeading>
          <p>{error.message}</p>
        </section>
      </Layout>
    </Document>
  );
}
