import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';
import type { ActionResult } from '../ActionResult';
import type { MarkdownFile } from '../github/fetchMarkdownFile';

enum FetchMarkdownFilesResState {
  directoryNotFound = 'directory_not_found',
  internalError = 'internal_error',
  success = 'success',
}

async function fetchMarkdownFilesFs<FrontMatter>(
  path: string,
  hasValidFrontMatter: (attributes: unknown) => attributes is FrontMatter & Record<string, unknown>,
): Promise<ActionResult<FetchMarkdownFilesResState, MarkdownFile<FrontMatter>[]>> {
  console.debug('fs/fetchMarkdownFiles called');

  const entries = await fs.readdir(path, {
    encoding: 'utf8',
    withFileTypes: true,
  });
  if (!entries) {
    return [404, FetchMarkdownFilesResState.directoryNotFound, undefined];
  }

  const mdFiles: MarkdownFile<FrontMatter>[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      const file = await fs.readFile(`${path}/${entry.name}`);
      if (!file) {
        return [500, FetchMarkdownFilesResState.internalError, undefined];
      }
      const str = file.toString();
      const { attributes, body } = parseFrontMatter(str);
      try {
        invariant(hasValidFrontMatter(attributes), `File ${entry.name} is missing frontmatter attributes`);
      } catch (error: any) {
        console.error(error);
        return [500, FetchMarkdownFilesResState.internalError, undefined];
      }
      if (attributes.ignore) {
        continue;
      }
      mdFiles.push({ slug: entry.name, frontmatter: attributes, markdown: body });
    }
  }

  return [200, FetchMarkdownFilesResState.success, mdFiles];
}

export { fetchMarkdownFilesFs, FetchMarkdownFilesResState };
