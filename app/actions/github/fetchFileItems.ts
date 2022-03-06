import type { ActionResult } from '../ActionResult';

enum FetchFileItemsResState {
  directoryNotFound = 'directory_not_found',
  internalError = 'internal_error',
  success = 'success',
}

type GitHubFileObject = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
};

type FileItem = {
  slug: string;
  path: string;
};

interface GithubContentResponse extends GitHubFileObject {
  entries: GitHubFileObject[];
}

/**
 * fetches meta data about files without content from a given directory
 */
async function fetchFileItems(
  accessToken: string,
  directoryUrl: string,
): Promise<ActionResult<FetchFileItemsResState, FileItem[]>> {
  console.debug('fetchFileItems called');

  const headers = new Headers();
  headers.set('Accept', 'application/vnd.github.v3.object');

  // don't confuse with OAuth auth token flow, this requires a private accessToken of the GitHub account
  headers.set('Authorization', `token ${accessToken}`);
  headers.set('User-Agent', 'Particular.Cloud');

  console.log(directoryUrl);
  const response = await fetch(directoryUrl, { headers });
  if (!response.ok || response.status !== 200) {
    console.error(
      `GitHub fetch markdown API request failed: ok: ${response.ok} (${response.status}): ${response.statusText}`,
    );
    if (response.status === 404) {
      return [response.status, FetchFileItemsResState.directoryNotFound, undefined];
    }
    return [response.status, FetchFileItemsResState.internalError, undefined];
  }

  const content: GithubContentResponse = await response.json();
  const files: FileItem[] = content.entries.map((entry) => ({
    slug: entry.name.replace('.md', '').replace('index', ''),
    path: entry.path.replace('.md', '').replace('index', ''),
  }));

  return [200, FetchFileItemsResState.success, files];
}

export type { FileItem };

export { fetchFileItems, FetchFileItemsResState };
