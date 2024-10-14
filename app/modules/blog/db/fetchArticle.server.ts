import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';
import { db } from '~/modules/db/db.server.ts';
import type { ActionResult, MarkdocFile } from '~/types.ts';
import { config } from '../config.ts';
import type { BlogArticleFrontmatter } from '../validation.server.ts';
import { Article, articlesTable } from '~/modules/db/schema.server.ts';
import { eq } from 'drizzle-orm';

export enum FetchArticleResState {
  fileNotFound = 'file_not_found',
  internalError = 'internal_error',
  success = 'success',
}

export function parseCategories(categories: unknown): string[] {
  if (typeof categories !== 'string') {
    const loggableVal = !!categories && typeof categories === 'object' && 'toString' in categories
      ? categories.toString()
      : null;
    throw Error(`Malformed categories, expected string: ${loggableVal}`);
  }
  const parsed = JSON.parse(categories);
  if (!Array.isArray(parsed)) {
    throw Error(`Malformed categories, expected array: ${parsed}`);
  }
  return parsed;
}

export function articleToMarkdocFile(
  article: Article,
  content: RenderableTreeNode,
): MarkdocFile<BlogArticleFrontmatter> {
  return {
    slug: article.slug,
    frontmatter: {
      title: article.title,
      description: article.description,
      date: article.date.toISOString(),
      categories: parseCategories(article.categories),
      imageUrl: article.imageUrl || undefined,
      imageAltText: article.imageAltText || undefined,
    },
    content,
    markdown: article.markdown,
  };
}

export async function fetchArticle(
  slug: string,
): Promise<ActionResult<FetchArticleResState, MarkdocFile<BlogArticleFrontmatter>>> {
  const [article] = await db.select().from(articlesTable).where(eq(articlesTable.slug, slug));
  if (!article) {
    return [404, FetchArticleResState.fileNotFound, undefined];
  }
  const ast = Markdoc.parse(article.markdown);
  const content = Markdoc.transform(ast, config);

  return [200, FetchArticleResState.success, articleToMarkdocFile(article, content)];
}
