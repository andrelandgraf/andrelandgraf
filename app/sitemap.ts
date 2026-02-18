import type { MetadataRoute } from 'next';
import { fetchArticlesFrontmatter } from '~/modules/blog/db/fetchArticles.server.ts';

const origin = process.env.ORIGIN?.trim() || 'https://andrelandgraf.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await fetchArticlesFrontmatter();

  return [
    {
      url: `${origin}/`,
      lastModified: new Date(),
    },
    {
      url: `${origin}/blog`,
      lastModified: new Date(),
    },
    ...articles.map((article) => ({
      url: `${origin}/blog/${article.slug}`,
      lastModified: article.date,
    })),
  ];
}
