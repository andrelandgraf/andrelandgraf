import { LoaderFunctionArgs } from '@remix-run/node';
import { internalServerError } from '~/modules/responses.server.ts';
import { captureException } from '~/modules/sentry/capture.server.ts';
import { getImgResponse, GetImgSourceArgs } from 'openimg/node';
import { env } from '~/modules/env.server';

export { headers } from '~/modules/headers.server.ts';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const headers = new Headers();
    headers.set('Cache-Control', `public, max-age=${60 * 60 * 24}`); // 24h
    return getImgResponse(request, {
      headers,
      allowlistedOrigins: [env.server.origin],
      getImgSource: ({ request, params }: GetImgSourceArgs) => {
        const url = new URL(request.url);
        const gen = url.searchParams.get('gen');
        const src = url.searchParams.get('src');
        if (!src) {
          throw new Error('src is required');
        }
        if (gen) {
          return {
            type: 'fetch',
            url: env.server.origin + src,
          };
        }

        if (URL.canParse(src)) {
          return {
            type: 'fetch',
            url: src,
          };
        }

        return {
          type: 'fs',
          path: './public' + src,
        };
      },
    });
  } catch (err: unknown) {
    console.error(err);
    captureException(err);
    return internalServerError();
  }
}
