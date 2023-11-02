import Markdoc from '@markdoc/markdoc';
import yaml from 'js-yaml';
import invariant from 'tiny-invariant';

import type { ActionResult, MarkdocFile } from '~/types';

import { config } from '../config';

export enum FetchMarkdownFileResState {
  fileNotFound = 'file_not_found',
  fileFrontmatterMissing = 'file_frontmatter_missing',
  fileIgnored = 'file_ignored',
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

export async function fetchMarkdownFile<FrontMatter>(
  accessToken: string,
  path: string,
  slug = '',
  hasValidFrontMatter: (attributes: unknown) => attributes is FrontMatter & Record<string, unknown>,
): Promise<ActionResult<FetchMarkdownFileResState, MarkdocFile<FrontMatter>>> {
  const contentUrl = getContentPath(path, slug);

  const headers = new Headers();
  headers.set('Accept', 'application/vnd.github.v3.raw');

  // don't confuse with OAuth auth token flow, this requires a private accessToken of the GitHub account
  headers.set('Authorization', `token ${accessToken}`);
  headers.set('User-Agent', 'andre-landgraf.cool');

  const response = await fetch(contentUrl, { headers });
  if (!response.ok || response.status !== 200) {
    console.error(
      `GitHub fetch markdown API request failed: ok: ${response.ok} (${response.status}): ${response.statusText}`,
    );
    if (response.status === 404) {
      return [response.status, FetchMarkdownFileResState.fileNotFound, undefined];
    }
    return [response.status, FetchMarkdownFileResState.internalError, undefined];
  }

  const textContent = await response.text();
  const ast = Markdoc.parse(textContent);
  const frontmatter = ast.attributes.frontmatter ? yaml.load(ast.attributes.frontmatter) : {};
  if (frontmatter && typeof frontmatter === 'object' && 'ignore' in frontmatter && frontmatter.ignore) {
    return [404, FetchMarkdownFileResState.fileIgnored, undefined];
  }
  try {
    invariant(hasValidFrontMatter(frontmatter), `File ${contentUrl} is missing frontmatter attributes`);
  } catch (error: any) {
    console.error(error);
    return [500, FetchMarkdownFileResState.fileFrontmatterMissing, undefined];
  }

  const content = Markdoc.transform(ast, config);
  return [200, FetchMarkdownFileResState.success, { slug, frontmatter, content }];
}
