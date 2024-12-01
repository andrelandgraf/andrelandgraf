import Markdoc from '@markdoc/markdoc';
import fs from 'node:fs/promises';
import yaml from 'js-yaml';
import invariant from 'tiny-invariant';
import type { ActionResult } from '~/types.ts';
import { getMarkdocConfig } from '../config.server.ts';
import { MarkdocFile } from './fetchMarkdownFile.server.ts';

enum FetchMarkdownFilesResState {
  directoryNotFound = 'directory_not_found',
  internalError = 'internal_error',
  success = 'success',
}

async function fetchMarkdownFilesFs<FrontMatter>(
  path: string,
  hasValidFrontMatter: (attributes: unknown) => attributes is FrontMatter & Record<string, unknown>,
): Promise<ActionResult<FetchMarkdownFilesResState, MarkdocFile<FrontMatter>[]>> {
  console.debug('fs/fetchMarkdownFiles called');
  const markdocConfig = await getMarkdocConfig();
  const entries = await fs.readdir(path, {
    encoding: 'utf8',
    withFileTypes: true,
  });
  if (!entries) {
    return [404, FetchMarkdownFilesResState.directoryNotFound, undefined];
  }

  const mdFiles: MarkdocFile<FrontMatter>[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      const file = await fs.readFile(`${path}/${entry.name}`);
      if (!file) {
        return [500, FetchMarkdownFilesResState.internalError, undefined];
      }
      const markdown = file.toString();
      const ast = Markdoc.parse(markdown);
      const frontmatter = ast.attributes.frontmatter ? yaml.load(ast.attributes.frontmatter) : {};
      if (frontmatter && typeof frontmatter === 'object' && 'ignore' in frontmatter && frontmatter.ignore) {
        continue;
      }
      try {
        invariant(hasValidFrontMatter(frontmatter), `File ${entry.name} is missing frontmatter attributes`);
      } catch (error: unknown) {
        console.error(error);
        return [500, FetchMarkdownFilesResState.internalError, undefined];
      }

      const content = Markdoc.transform(ast, markdocConfig);
      mdFiles.push({
        slug: entry.name.replace('.md', '').replace('index', ''),
        frontmatter,
        content,
        markdown,
      });
    }
  }

  return [200, FetchMarkdownFilesResState.success, mdFiles];
}

export { fetchMarkdownFilesFs, FetchMarkdownFilesResState };
