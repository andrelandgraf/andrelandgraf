import Markdoc from '@markdoc/markdoc';
import { db } from '~/modules/db/db.server.ts';
import type { MarkdocFile } from '~/types.ts';
import { config } from '../config.ts';
import type { BlogArticleFrontmatter } from '../validation.server.ts';
import { articleToMarkdocFile, parseCategories } from './fetchArticle.server.ts';
import { articlesTable } from '~/modules/db/schema.server.ts';

export enum FetchArticleResState {
  internalError = 'internal_error',
  success = 'success',
}

export async function fetchArticles(): Promise<
  MarkdocFile<BlogArticleFrontmatter>[]
> {
  const articles = await db.select().from(articlesTable);
  return articles.map((article) => {
    const ast = Markdoc.parse(article.markdown);
    const content = Markdoc.transform(ast, config);
    return articleToMarkdocFile(article, content);
  });
}

export async function fetchArticlesFrontmatter() {
  const articles = await db.select({
    slug: articlesTable.slug,
    title: articlesTable.title,
    categories: articlesTable.categories,
    description: articlesTable.description,
    date: articlesTable.date,
  }).from(articlesTable);
  return articles.map((article) => {
    return {
      ...article,
      categories: parseCategories(article.categories),
    };
  });
}
