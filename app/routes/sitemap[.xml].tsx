import { fetchArticlesFrontmatter } from '~/modules/blog/db/fetchArticles.server.ts';

function getUrlElementWithDate(url: string, date: string) {
  return `<url>
        <loc>${url}</loc>
        <lastmod>${date}</lastmod>
        </url>`;
}

function generateSiteMap(articles: { slug: string; date: Date }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
            ${getUrlElementWithDate('https://andrelandgraf.dev/', new Date().toISOString())}
            ${getUrlElementWithDate('https://andrelandgraf.dev/blog', new Date().toISOString())}
            ${
    articles
      .map(
        (article) =>
          `${
            getUrlElementWithDate(
              `https://andrelandgraf.dev/blog/${article.slug}`,
              article.date.toISOString(),
            )
          }`,
      )
      .join('\n')
  }
        </urlset>`;
}

export async function loader() {
  const articles = await fetchArticlesFrontmatter();
  return new Response(generateSiteMap(articles), {
    headers: {
      'content-type': 'application/xml',
    },
  });
}
