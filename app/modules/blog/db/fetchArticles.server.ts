import Markdoc from '@markdoc/markdoc';
import { db } from '~/modules/db/db.server.ts';
import { parseCategories } from './fetchArticle.server.ts';
import { Article, articlesTable } from '~/modules/db/schema.server.ts';

export enum FetchArticleResState {
  internalError = 'internal_error',
  success = 'success',
}

export type ArticleListItem = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  categories: string[];
  imageUrl?: string;
  imageAltText?: string;
  newVersionSlug?: string;
};

export function toArticleListItem(article: Article): ArticleListItem {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date,
    categories: parseCategories(article.categories),
    imageUrl: article.imageUrl || undefined,
    imageAltText: article.imageAltText || undefined,
    newVersionSlug: article.newVersionSlug || undefined,
  };
}

export async function fetchArticles(): Promise<ArticleListItem[]> {
  const articles = await db.select().from(articlesTable);
  return articles.map((article) => {
    return toArticleListItem(article);
  });
}

export async function fetchArticlesFrontmatter() {
  const articles = await db
    .select({
      slug: articlesTable.slug,
      title: articlesTable.title,
      categories: articlesTable.categories,
      description: articlesTable.description,
      date: articlesTable.date,
    })
    .from(articlesTable);
  return articles.map((article) => {
    return {
      ...article,
      categories: parseCategories(article.categories),
    };
  });
}
