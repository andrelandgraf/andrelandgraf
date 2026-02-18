import satori from 'satori';
import sharp from 'sharp';
import { fetchArticle } from '~/modules/blog/db/fetchArticle.server.ts';
import { ArticlePreview } from '~/modules/image-gen/templates.tsx';
import { getFont } from '~/modules/image-gen/utils.server.ts';
import { env } from '~/modules/env.server.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  const slug = params.slug;
  if (typeof slug !== 'string') {
    return new Response(null, { status: 404, statusText: 'Not Found' });
  }

  const url = new URL(request.url);
  const includeQRCode = url.searchParams.has('qr');

  const [status, state, article] = await fetchArticle(slug);
  if (status !== 200 || !article) {
    if (status === 404) {
      return new Response(null, { status: 404, statusText: 'Not Found' });
    }
    throw new Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }

  const jsx = ArticlePreview({
    serverOrigin: env.server.origin,
    title: article.title,
    slug,
    includeQRCode,
  });

  const svg = await satori(jsx, {
    width: 1200,
    height: 1200,
    fonts: await getFont('Roboto'),
  });
  const data = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': `public, max-age=${60 * 60 * 24}`,
    },
  });
}
