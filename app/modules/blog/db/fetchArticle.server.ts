import { aliasedTable, eq } from 'drizzle-orm';
import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';
import { db } from '~/modules/db/db.server.ts';
import type { ActionResult } from '~/types.ts';
import { config } from '../config.ts';
import { Article, articlesTable } from '~/modules/db/schema.server.ts';

export enum FetchArticleResState {
  fileNotFound = 'file_not_found',
  internalError = 'internal_error',
  success = 'success',
}

export function parseCategories(categories: unknown): string[] {
  if (typeof categories !== 'string') {
    const loggableVal =
      !!categories && typeof categories === 'object' && 'toString' in categories ? categories.toString() : null;
    throw Error(`Malformed categories, expected string: ${loggableVal}`);
  }
  const parsed = JSON.parse(categories);
  if (!Array.isArray(parsed)) {
    throw Error(`Malformed categories, expected array: ${parsed}`);
  }
  return parsed;
}

export type ArticleDetails = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  categories: string[];
  imageUrl?: string;
  imageAltText?: string;
  newVersionSlug?: string;
  newVersionTitle?: string;
  content: RenderableTreeNode;
};

export function toArticleDetails(
  article: Article & { newVersionTitle?: string | null },
  content: RenderableTreeNode,
): ArticleDetails {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date,
    categories: parseCategories(article.categories),
    imageUrl: article.imageUrl || undefined,
    imageAltText: article.imageAltText || undefined,
    newVersionSlug: article.newVersionSlug || undefined,
    newVersionTitle: article.newVersionTitle || undefined,
    content,
  };
}

export async function fetchArticle(slug: string): Promise<ActionResult<FetchArticleResState, ArticleDetails>> {
  const newArticlesTable = aliasedTable(articlesTable, 'newArticle');
  const [article] = (await db
    .select({
      slug: articlesTable.slug,
      title: articlesTable.title,
      description: articlesTable.description,
      date: articlesTable.date,
      categories: articlesTable.categories,
      imageUrl: articlesTable.imageUrl,
      imageAltText: articlesTable.imageAltText,
      newVersionSlug: articlesTable.newVersionSlug,
      newVersionTitle: newArticlesTable.title,
      markdown: articlesTable.markdown,
    })
    .from(articlesTable)
    .leftJoin(newArticlesTable, eq(newArticlesTable.slug, articlesTable.newVersionSlug))
    .where(eq(articlesTable.slug, slug))) as (Article & { newVersionTitle?: string | null })[];
  if (!article) {
    return [404, FetchArticleResState.fileNotFound, undefined];
  }
  const ast = Markdoc.parse(article.markdown);
  const content = Markdoc.transform(ast, config);

  return [200, FetchArticleResState.success, toArticleDetails(article, content)];
}
