import type { ActionResult } from '../ActionResult';
import type { MarkdownFile } from './fetchMarkdownFile';
import { fetchFileItems, FetchFileItemsResState } from './fetchFileItems';
import { fetchMarkdownFile, FetchMarkdownFileResState } from './fetchMarkdownFile';

enum FetchMarkdownFilesResState {
  directoryNotFound = 'directory_not_found',
  internalError = 'internal_error',
  success = 'success',
}

async function fetchMarkdownFiles<FrontMatter>(
  accessToken: string,
  directoryUrl: string,
  hasValidFrontMatter: (attributes: unknown) => attributes is FrontMatter & Record<string, unknown>,
): Promise<ActionResult<FetchMarkdownFilesResState, MarkdownFile<FrontMatter>[]>> {
  console.debug('fetchMarkdownFiles called');

  const [status, state, items] = await fetchFileItems(accessToken, directoryUrl);
  if (status !== 200 || !items) {
    return [
      status,
      state === FetchFileItemsResState.directoryNotFound
        ? FetchMarkdownFilesResState.directoryNotFound
        : FetchMarkdownFilesResState.internalError,
      undefined,
    ];
  }

  const mdFiles: MarkdownFile<FrontMatter>[] = [];
  for (const item of items) {
    const [fetchStatus, fetchState, file] = await fetchMarkdownFile(
      accessToken,
      directoryUrl,
      item.slug,
      hasValidFrontMatter,
    );
    if (fetchStatus !== 200 || !file) {
      if (fetchState === FetchMarkdownFileResState.fileIgnored) {
        continue;
      }
      console.error(`FetchMarkdownFiles failed for ${directoryUrl}/${item.slug} with [${fetchStatus}] ${fetchState}.`);
      return [fetchStatus, FetchMarkdownFilesResState.internalError, undefined];
    }
    mdFiles.push(file);
  }
  return [200, FetchMarkdownFilesResState.success, mdFiles];
}

export { fetchMarkdownFiles, FetchMarkdownFilesResState };
