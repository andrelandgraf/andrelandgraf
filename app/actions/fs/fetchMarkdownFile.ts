import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';
import type { ActionResult } from '../ActionResult';
import type { MarkdownFile } from '../github/fetchMarkdownFile';

enum FetchMarkdownFileResState {
  fileNotFound = 'file_not_found',
  internalError = 'internal_error',
  success = 'success',
}

const getContentPath = (url: string, slug: string): string => {
  let fileName = slug;
  if (slug === '') {
    fileName = 'index';
  }
  return `${url}/${fileName}.md`;
};

async function fetchMarkdownFileFs<FrontMatter>(
  path: string,
  slug: string,
  hasValidFrontMatter: (attributes: unknown) => attributes is FrontMatter & Record<string, unknown>,
): Promise<ActionResult<FetchMarkdownFileResState, MarkdownFile<FrontMatter>>> {
  console.debug('fs/fetchMarkdownFile called');

  const file = await fs.readFile(getContentPath(path, slug), 'utf8');
  if (!file) {
    return [500, FetchMarkdownFileResState.fileNotFound, undefined];
  }
  const str = file.toString();
  const { attributes, body } = parseFrontMatter(str);
  try {
    invariant(hasValidFrontMatter(attributes), `File ${slug} is missing frontmatter attributes`);
  } catch (error: any) {
    console.error(error);
    return [500, FetchMarkdownFileResState.internalError, undefined];
  }

  return [
    200,
    FetchMarkdownFileResState.success,
    {
      slug,
      frontmatter: attributes,
      markdown: body,
    },
  ];
}

export { fetchMarkdownFileFs, FetchMarkdownFileResState };
