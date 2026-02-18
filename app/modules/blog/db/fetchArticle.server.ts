import type { RenderableTreeNode } from '@markdoc/markdoc';
import { FetchMarkdownFilesResState, fetchMarkdownFilesFs } from '~/modules/blog/fs/fetchMarkdownFiles.server.ts';
import { BlogArticleFrontmatter, validateFrontMatter } from '~/modules/blog/validation.server.ts';
import type { ActionResult } from '~/types.ts';

export enum FetchArticleResState {
  fileNotFound = 'file_not_found',
  internalError = 'internal_error',
  success = 'success',
}

export function parseCategories(categories: unknown): string[] {
  if (Array.isArray(categories) && categories.every((category) => typeof category === 'string')) {
    return categories as string[];
  }
  if (typeof categories !== 'string') {
    throw Error('Malformed categories, expected string[]');
  }
  const parsed = JSON.parse(categories);
  if (!Array.isArray(parsed)) {
    throw Error(`Malformed categories, expected array: ${parsed}`);
  }
  return parsed as string[];
}

function formatDate(value: Date | string): string {
  if (typeof value === 'string') {
    return value.split('T')[0];
  }
  return value.toISOString().split('T')[0];
}

export type ArticleDetails = {
  slug: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  imageUrl?: string;
  imageAltText?: string;
  newVersionSlug?: string;
  newVersionTitle?: string;
  content: RenderableTreeNode;
};

type ArticleFile = {
  slug: string;
  frontmatter: BlogArticleFrontmatter;
  content: RenderableTreeNode;
};

export function toArticleDetails(article: ArticleFile, newVersionTitle?: string): ArticleDetails {
  return {
    slug: article.slug,
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    date: formatDate(article.frontmatter.date),
    categories: parseCategories(article.frontmatter.categories),
    imageUrl: article.frontmatter.imageUrl || undefined,
    imageAltText: article.frontmatter.imageAltText || undefined,
    newVersionSlug: article.frontmatter.newVersionSlug || undefined,
    newVersionTitle,
    content: article.content,
  };
}

export async function fetchArticle(slug: string): Promise<ActionResult<FetchArticleResState, ArticleDetails>> {
  const [status, state, files] = await fetchMarkdownFilesFs('./contents/articles', validateFrontMatter);
  if (state !== FetchMarkdownFilesResState.success || !files) {
    return [status, FetchArticleResState.internalError, undefined];
  }

  const article = files.find((file) => file.slug === slug);
  if (!article) {
    return [404, FetchArticleResState.fileNotFound, undefined];
  }

  const newVersionTitle = article.frontmatter.newVersionSlug
    ? files.find((file) => file.slug === article.frontmatter.newVersionSlug)?.frontmatter.title
    : undefined;

  return [200, FetchArticleResState.success, toArticleDetails(article, newVersionTitle)];
}
