import { getImgResponse, type GetImgSourceArgs } from 'openimg/node';
import { env } from '~/modules/env.server.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const headers = new Headers();
    headers.set('Cache-Control', `public, max-age=${60 * 60 * 24}`);
    const requestOrigin = new URL(request.url).origin;
    const origin = env.server.origin || requestOrigin;

    return getImgResponse(request, {
      headers,
      cacheFolder: 'no_cache',
      allowlistedOrigins: Array.from(new Set([origin, requestOrigin])),
      getImgSource: ({ request }: GetImgSourceArgs) => {
        const url = new URL(request.url);
        const gen = url.searchParams.get('gen');
        const src = url.searchParams.get('src');
        if (!src) {
          throw new Error('src is required');
        }
        if (gen) {
          return {
            type: 'fetch',
            url: URL.canParse(src) ? src : new URL(src, requestOrigin).toString(),
          };
        }

        if (URL.canParse(src)) {
          return {
            type: 'fetch',
            url: src,
          };
        }

        return {
          type: 'fetch',
          url: new URL(src, requestOrigin).toString(),
        };
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
