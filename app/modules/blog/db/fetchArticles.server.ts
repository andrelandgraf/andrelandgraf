import Markdoc from '@markdoc/markdoc';
import invariant from 'tiny-invariant';

import { db } from '~/modules/db.server';
import { fetchEmbedding, FetchEmbeddingResState, MAX_CONTENT_LENGTH } from '~/modules/openAI/fetchOpenAI';
import type { ActionResult, MarkdocFile } from '~/types';

import { config } from '../config';
import type { BlogArticleFrontmatter } from '../validation.server';
import { articleToMarkdocFile } from './fetchArticle.server';

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
    mdArticles.push(articleToMarkdocFile(article, content));
  }
  return [200, FetchArticleResState.success, mdArticles];
}

type FilesWithSimilarity = Array<
  MarkdocFile<BlogArticleFrontmatter> & {
    articleId: string;
    chunks: Array<{ similarity: number; chunkIndex: number }>;
  }
>;

function validateMatches(
  matches: unknown,
): matches is Array<{ articleId: string; chunkIndex: number; similarity: number }> {
  if (!Array.isArray(matches)) {
    return false;
  }
  for (const match of matches) {
    if (
      typeof match !== 'object' ||
      typeof match.articleId !== 'string' ||
      typeof match.chunkIndex !== 'number' ||
      typeof match.similarity !== 'number'
    ) {
      return false;
    }
  }
  return true;
}

export async function fetchClosestArticles({
  content,
  openAIKey,
}: {
  content: string;
  openAIKey: string;
}): Promise<ActionResult<FetchEmbeddingResState, FilesWithSimilarity>> {
  const [status, state, embedding] = await fetchEmbedding({ content, openAIKey });
  if (!embedding || state !== FetchEmbeddingResState.success) {
    return [status, state, undefined];
  }
  const vectorQuery = `[${embedding.join(',')}]`;
  const matches = await db.$queryRaw`
    SELECT
      "articleId",
      "chunkIndex",
      1 - (embedding <=> ${vectorQuery}::vector) as similarity
    FROM "ArticleEmbedding"
    WHERE 1 - (embedding <=> ${vectorQuery}::vector) > .5
    ORDER BY  similarity DESC
    LIMIT 3;
  `;
  invariant(validateMatches(matches), 'ArticleEmbedding matches invalid');

  // Only use matches with similarity > 0.5
  let closeMatches = matches.filter((match) => match.similarity > 0.5);
  const articles = await db.article.findMany({
    where: { id: { in: closeMatches.map((match) => match.articleId) } },
  });

  const mdArticles: FilesWithSimilarity = [];
  for (const article of articles) {
    const ast = Markdoc.parse(article.markdown);
    const content = Markdoc.transform(ast, config);
    const data = {
      ...articleToMarkdocFile(article, content),
      articleId: article.id,
      chunks: closeMatches.filter((match) => match.articleId === article.id),
    };
    mdArticles.push(data);
  }
  return [200, FetchEmbeddingResState.success, mdArticles];
}

export function getContentOfChunkIndex(content: string, chunkIndex = 0) {
  const chunkSize = MAX_CONTENT_LENGTH['text-embedding-ada-002'];
  const start = chunkIndex * chunkSize;
  const end = start + chunkSize;
  return content.slice(start, end);
}
