import { fetchArticles } from '~/modules/blog/db/fetchArticles.server';
import type { BlogArticleFrontmatter } from '~/modules/blog/validation.server';
import type { MarkdocFile } from '~/types';

function generateRSS(articles: MarkdocFile<BlogArticleFrontmatter>[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
    <channel>
    <title>andrelandgraf.dev</title>
    <description>Hey there! I write about all things web development. Check out my blog posts.</description>
    <link>https://andrelandgraf.dev</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${articles
      .map((article) => {
        return `<item>
        <title>${article.frontmatter.title}</title>
        <description>${article.frontmatter.description}</description>
        <link>https://andrelandgraf.dev/blog/${article.slug}</link>
        <pubDate>${new Date(article.frontmatter.date).toUTCString()}</pubDate>
        </item>`;
      })
      .join('\n')}
    </channel>
    </rss>`;
}

export async function loader() {
  const [status, state, articles] = await fetchArticles();
  if (status !== 200 || !articles) {
    throw Error(`Error (${status}) ${state}: Failed to fetch blog articles.`);
  }
  return new Response(generateRSS(articles), {
    headers: {
      'content-type': 'application/rss+xml',
    },
  });
}
