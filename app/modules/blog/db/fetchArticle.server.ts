import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';
import type { Article } from '@prisma/client';

import { db } from '~/modules/db.server';
import type { ActionResult, MarkdocFile } from '~/types';

import { config } from '../config';
import type { BlogArticleFrontmatter } from '../validation.server';

export enum FetchArticleResState {
  fileNotFound = 'file_not_found',
  internalError = 'internal_error',
  success = 'success',
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
      categories: article.categories,
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
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) {
    return [404, FetchArticleResState.fileNotFound, undefined];
  }
  const ast = Markdoc.parse(article.markdown);
  const content = Markdoc.transform(ast, config);

  return [200, FetchArticleResState.success, articleToMarkdocFile(article, content)];
}
