import type { ActionResult } from '../ActionResult';

enum GithubAuthTokenResState {
  codeRequired = 'code_required',
  verifyError = 'verify_error',
  internalError = 'internal_error',
  success = 'success',
}

type HeadersWithAuthorization = Headers;

async function getGitHubAuthToken(
  clientId: string,
  clientSecret: string,
  forUser = true,
  code?: string,
): Promise<ActionResult<GithubAuthTokenResState, HeadersWithAuthorization>> {
  console.debug('getGitHubAuthToken called');
  try {
    if (forUser && !code) {
      console.error('Code required for github login action!');
      return [400, GithubAuthTokenResState.codeRequired, undefined];
    }

    const url = new URL('https://github.com/login/oauth/access_token');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('client_secret', clientSecret);
    if (code) {
      url.searchParams.set('code', code);
    }

    const response = await fetch(url.toString(), {
      method: 'post',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok || response.status !== 200) {
      console.error(`Request to github oauth failed with ok: ${response.ok} and status: ${response.status}.`);
      return [500, GithubAuthTokenResState.verifyError, undefined];
    }

    const body = await response.json();
    const accessToken = body?.access_token;
    if (!accessToken) {
      console.error(
        `Request to github oauth failed with status (${response.status}): ${
          response.statusText
        } and body: ${JSON.stringify(body)}.`,
      );
      return [500, GithubAuthTokenResState.verifyError, undefined];
    }

    const headers = new Headers();
    headers.set('Authorization', `token ${accessToken}`);
    headers.set('User-Agent', 'andre-landgraf.cool');

    return [200, GithubAuthTokenResState.success, headers];
  } catch (error) {
    console.error(error);
    return [500, GithubAuthTokenResState.internalError, undefined];
  }
}

export { GithubAuthTokenResState };

export default getGitHubAuthToken;
