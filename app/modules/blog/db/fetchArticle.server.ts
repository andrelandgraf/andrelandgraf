import Markdoc from '@markdoc/markdoc';

import { db } from '~/modules/db.server';
import type { ActionResult, MarkdocFile } from '~/types';

import { config } from '../config';
import type { BlogArticleFrontmatter } from '../validation.server';

export enum FetchArticleResState {
  fileNotFound = 'file_not_found',
  internalError = 'internal_error',
  success = 'success',
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
  const data = {
    slug: article.slug,
    frontmatter: {
      title: article.title,
      description: article.description,
      date: article.date.toISOString(),
      categories: article.categories,
    },
    content,
    markdown: article.markdown,
  };
  return [200, FetchArticleResState.success, data];
}
