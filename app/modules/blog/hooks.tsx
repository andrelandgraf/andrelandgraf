import { useRouteLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import type { loader } from '~/routes/_layout.blog';

export function useBlogContent() {
  const data = useRouteLoaderData<typeof loader>('routes/_layout.blog');
  invariant(data, 'Expected blog route to be matching.');
  return data;
}
