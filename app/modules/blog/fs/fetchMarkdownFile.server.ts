import Markdoc from '@markdoc/markdoc';
import fs from 'node:fs/promises';
import yaml from 'js-yaml';
import invariant from 'tiny-invariant';
import type { ActionResult, MarkdocFile } from '~/types.ts';
import { config } from '../config.ts';

export enum FetchMarkdownFileResState {
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

export async function fetchMarkdownFileFs<FrontMatter>(
  path: string,
  slug: string,
  hasValidFrontMatter: (attributes: unknown) => attributes is FrontMatter & Record<string, unknown>,
): Promise<ActionResult<FetchMarkdownFileResState, MarkdocFile<FrontMatter>>> {
  const file = await fs.readFile(getContentPath(path, slug), 'utf8');
  if (!file) {
    return [500, FetchMarkdownFileResState.fileNotFound, undefined];
  }
  const markdown = file.toString();
  const ast = Markdoc.parse(markdown);
  const frontmatter = ast.attributes.frontmatter ? yaml.load(ast.attributes.frontmatter) : {};
  try {
    invariant(hasValidFrontMatter(frontmatter), `File ${slug} is missing frontmatter information`);
  } catch (error: unknown) {
    console.error(error);
    return [500, FetchMarkdownFileResState.internalError, undefined];
  }

  const content = Markdoc.transform(ast, config);
  return [
    200,
    FetchMarkdownFileResState.success,
    {
      slug,
      frontmatter,
      content,
      markdown,
    },
  ];
}
