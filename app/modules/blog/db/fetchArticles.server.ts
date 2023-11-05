import Markdoc from '@markdoc/markdoc';

import { db } from '~/modules/db.server';
import type { ActionResult, MarkdocFile } from '~/types';

import { config } from '../config';
import type { BlogArticleFrontmatter } from '../validation.server';

export enum FetchArticleResState {
  internalError = 'internal_error',
  success = 'success',
}

export async function fetchArticles(): Promise<
  ActionResult<FetchArticleResState, MarkdocFile<BlogArticleFrontmatter>[]>
> {
  const articles = await db.article.findMany();

  const mdArticles: MarkdocFile<BlogArticleFrontmatter>[] = [];
  for (const article of articles) {
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
    mdArticles.push(data);
  }
  return [200, FetchArticleResState.success, mdArticles];
}
