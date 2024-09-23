import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { LoaderFunctionArgs } from '@remix-run/node';
import { getFont } from '~/modules/image-gen/utils.server';
import { fetchArticle } from '~/modules/blog/db/fetchArticle.server';
import { ArticlePreview } from '~/modules/image-gen/templates';
import { env } from '~/modules/env.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  if (typeof slug !== 'string') {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }

  const url = new URL(request.url);
  const includeQRCode = url.searchParams.has('qr');

  const [status, state, article] = await fetchArticle(slug);
  if (status !== 200 || !article) {
    if (status === 404) {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    }
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }

  const jsx = (
    <ArticlePreview
      serverOrigin={env.server.origin}
      title={article.frontmatter.title}
      description={article.frontmatter.description}
      slug={slug}
      includeQRCode={includeQRCode}
    />
  );

  const svg = await satori(jsx, {
    width: 1200,
    height: 1200,
    fonts: await getFont('Roboto'),
  });
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const data = pngData.asPng();
  return new Response(data, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': `public, max-age=${60 * 60 * 24}`,
    },
  });
}
