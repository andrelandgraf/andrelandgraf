import { FetchMarkdownFilesResState, fetchMarkdownFilesFs } from '~/modules/blog/fs/fetchMarkdownFiles.server.ts';
import { parseCategories } from './fetchArticle.server.ts';
import { validateFrontMatter } from '../validation.server.ts';

export enum FetchArticleResState {
  internalError = 'internal_error',
  success = 'success',
}

export type ArticleListItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  imageUrl?: string;
  imageAltText?: string;
  newVersionSlug?: string;
};

function formatDate(value: Date | string): string {
  if (typeof value === 'string') {
    return value.split('T')[0];
  }
  return value.toISOString().split('T')[0];
}

type ArticleFrontmatter = {
  slug: string;
  title: string;
  description: string;
  date: Date | string;
  categories: unknown;
  imageUrl?: string;
  imageAltText?: string;
  newVersionSlug?: string;
};

export function toArticleListItem(article: ArticleFrontmatter): ArticleListItem {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: formatDate(article.date),
    categories: parseCategories(article.categories),
    imageUrl: article.imageUrl || undefined,
    imageAltText: article.imageAltText || undefined,
    newVersionSlug: article.newVersionSlug || undefined,
  };
}

export async function fetchArticles(): Promise<ArticleListItem[]> {
  const [_status, state, files] = await fetchMarkdownFilesFs('./contents/articles', validateFrontMatter);
  if (state !== FetchMarkdownFilesResState.success || !files) {
    return [];
  }

  const articles = files.map((file) => ({
    slug: file.slug,
    ...file.frontmatter,
  }));

  return articles.map((article) => {
    return toArticleListItem(article);
  });
}

export async function fetchArticlesFrontmatter() {
  const [_status, state, files] = await fetchMarkdownFilesFs('./contents/articles', validateFrontMatter);
  if (state !== FetchMarkdownFilesResState.success || !files) {
    return [];
  }

  const articles = files.map((file) => ({
    slug: file.slug,
    title: file.frontmatter.title,
    categories: file.frontmatter.categories,
    description: file.frontmatter.description,
    date: file.frontmatter.date,
  }));

  return articles.map((article) => {
    return {
      ...article,
      categories: parseCategories(article.categories),
    };
  });
}
