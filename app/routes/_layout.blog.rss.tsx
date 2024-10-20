import { fetchArticlesFrontmatter } from '~/modules/blog/db/fetchArticles.server.ts';

type RSSArticles = {
  slug: string;
  date: Date;
  title: string;
  description: string;
};

function generateRSS(articles: RSSArticles[]) {
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
        <title>${article.title}</title>
        <description>${article.description}</description>
        <link>https://andrelandgraf.dev/blog/${article.slug}</link>
        <pubDate>${new Date(article.date).toUTCString()}</pubDate>
        </item>`;
      })
      .join('\n')}
    </channel>
    </rss>`;
}

export async function loader() {
  const articles = await fetchArticlesFrontmatter();
  return new Response(generateRSS(articles), {
    headers: {
      'content-type': 'application/rss+xml',
    },
  });
}
