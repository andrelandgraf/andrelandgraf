import { LoaderFunctionArgs } from '@remix-run/node';
import { env } from '~/modules/env.server.ts';
import { internalServerError, notFound } from '~/modules/responses.server.ts';
import { captureException } from '~/modules/sentry/capture.server.ts';
import { type ObjectFit } from '~/modules/image-opt/utils.ts';
import { getServerTiming } from '~/modules/server-timing.server.ts';
import { getImgResponse } from 'openimg-node';

export { headers } from '~/modules/headers.server.ts';

function getIntOrUndefined(value: string | null) {
  if (value === null) {
    return undefined;
  }

  return Number.parseInt(value);
}

function getObjectFit(fit: string | null): ObjectFit {
  if (fit === 'contain') {
    return 'contain';
  }

  return 'cover';
}

type ImageType = 'public' | 'gen' | 'pocketbase';

function getFilePath(
  type: ImageType,
  fileId: string,
  width: number | string,
  height: number | string,
  fit: 'cover' | 'contain' | 'base',
) {
  const widthInfo = `w-${width}`;
  const heightInfo = `h-${height}`;
  const fileName = fileId.replaceAll('.', '-');
  return `${env.server.volumePath}/images/${type}/${fileName}-${widthInfo}-${heightInfo}-${fit}.webp`;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { getHeaderField, getServerTimingHeader } = getServerTiming();
  const url = new URL(request.url);

  const headers = new Headers();
  headers.set('Content-Type', 'image/webp');
  headers.set('Cache-Control', `public, max-age=${60 * 60 * 24}`); // 24h
  headers.set('Server-Timing', getHeaderField());

  try {
    return getImgResponse(request, headers, {
      getImgParams: () => {
        const width = getIntOrUndefined(url.searchParams.get('w'));
        const height = getIntOrUndefined(url.searchParams.get('h'));
        if (Number.isNaN(width) || Number.isNaN(height)) {
          return new Response('w and h query parameters must be numbers', {
            status: 400,
            statusText: 'Bad Request',
          });
        }

        let fit = getObjectFit(url.searchParams.get('fit'));

        return {
          width,
          height,
          fit,
          targetFormat: 'webp',
        };
      },
      getImgSources: (_, { width, height, fit }) => {
        let cacheSrc: string | null = null;
        let originSrc: string | null = null;

        // path: /img/public/x/y/z.png for images in public folder
        if (url.pathname.startsWith('/img/public/')) {
          const urlPath = url.pathname;
          originSrc = "." + urlPath.replace('/img', ''); // "./public/x/y/z.png"
          const publicFileId = urlPath.replace('/img/public/', ''); // "x/y/z.png"
          cacheSrc = getFilePath('public', publicFileId, width || 'base', height || 'base', fit || 'base');
          console.log("stats", cacheSrc, originSrc);
        }

        // path: /img/gen/x/y/z.png for images generated via modules/image-gen
        if (url.pathname.startsWith('/img/gen/')) {
          const urlPath = url.pathname;
          const genFileId = urlPath.replace('/img/gen/', ''); // "x/y/z.png"
          cacheSrc = getFilePath('gen', genFileId, width || 'base', height || 'base', fit || 'base');
          originSrc = `${env.server.origin}/${genFileId}`; // URL to call generate endpoint
        }

        if (!cacheSrc || !originSrc) {
          return notFound();
        }

        return { cacheSrc, originSrc };
      },
    });
  } catch (err: unknown) {
    console.error(err);
    captureException(err);
    return internalServerError(getServerTimingHeader());
  }
}
