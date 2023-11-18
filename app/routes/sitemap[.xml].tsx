import { fetchArticles } from '~/modules/blog/db/fetchArticles.server';
import type { BlogArticleFrontmatter } from '~/modules/blog/validation.server';
import type { MarkdocFile } from '~/types';

function getUrlElementWithDate(url: string, date: string) {
  return `<url>
        <loc>${url}</loc>
        <lastmod>${date}</lastmod>
        </url>`;
}

function generateSiteMap(articles: MarkdocFile<BlogArticleFrontmatter>[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
            ${getUrlElementWithDate('https://andrelandgraf.dev', new Date().toISOString())}
            ${getUrlElementWithDate('https://andrelandgraf.dev/blog', new Date().toISOString())}
            ${articles
              .map(
                (article) =>
                  `${getUrlElementWithDate(
                    `https://andrelandgraf.dev/blog/${article.slug}`,
                    article.frontmatter.date,
                  )}`,
              )
              .join('\n')}
            ${getUrlElementWithDate('https://andrelandgraf.dev/cv', new Date().toISOString())}
            ${getUrlElementWithDate('https://andrelandgraf.dev/demos', new Date().toISOString())}
            ${getUrlElementWithDate('https://andrelandgraf.dev/demos/jumpNRun', new Date().toISOString())}
            ${getUrlElementWithDate('https://andrelandgraf.dev/tutoring', new Date().toISOString())}
            ${getUrlElementWithDate('https://andrelandgraf.dev/uses', new Date().toISOString())}
        </urlset>`;
}

export async function loader() {
  const [status, state, articles] = await fetchArticles();
  if (status !== 200 || !articles) {
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }
  return new Response(generateSiteMap(articles), {
    headers: {
      'content-type': 'application/xml',
    },
  });
}
