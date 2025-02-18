import { LoaderFunctionArgs } from '@remix-run/node';
import { internalServerError, notFound } from '~/modules/responses.server.ts';
import { captureException } from '~/modules/sentry/capture.server.ts';
import { Fit, Format, getImgResponse, GetImgSourceArgs } from 'openimg/node';
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
        if (gen) {
          return {
            type: 'fetch',
            url: env.server.origin + params.src,
          };
        }

        let isUrl = false;
        try {
          new URL(params.src);
          isUrl = true;
        } catch (err: unknown) {
          // ignore
        }

        if (isUrl) {
          return {
            type: 'fetch',
            url: params.src,
          };
        }

        return {
          type: 'fs',
          path: './public' + params.src,
        };
      },
    });
  } catch (err: unknown) {
    console.error(err);
    captureException(err);
    return internalServerError();
  }
}
