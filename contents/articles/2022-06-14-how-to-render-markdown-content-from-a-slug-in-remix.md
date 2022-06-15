---
date: 2022-06-14
title: How to render Markdown Content from a Slug in Remix
description: Markdown is a powerful tool for writing and publishing content. There are different ways of integrating Markdown in your Remix application. In this blog post, I want to show you how to fetch and render Markdown content based on a slug.
categories: [Remix.run]
ignore: true
---

## How to fetch multiple Markdown Files

Usually, you want to display a list of all your content to users as well. GitHub offers another API endpoint to get all files within a directory. From there, we can fetch each file content and parse the frontmatter. This should give us all the information required to render a list of contents.

**Note:** Alternatively, [github-md](https://github.com/jacob-ebey/github-md) also provides an API endpoint to get all files and additionally returns the the sha of the commit where each file was changed, so you could even create your own caching logic!

Let's fetch a list of all files in a directory from GitHub:

```typescript
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

interface GithubContentResponse extends GitHubFileObject {
  entries: GitHubFileObject[];
}

export async function fetchFileItems(dir: string): Promise<GitHubFileObject[]> {
  const accessToken = '<your-github-access-token>';
  const accountName = '<your-github-account-name>';
  const repoName = '<your-github-repo-name>';
  const headers = new Headers();
  headers.set('Accept', 'application/vnd.github.v3.object');
  headers.set('Authorization', `token ${accessToken}`);
  headers.set('User-Agent', '<your-app-name>');

  const repo = `https://api.github.com/repos/${accountName}/${repoName}`;
  const url = new URL(repo + dir);

  const response = await fetch(url, { headers });
  if (!response.ok || response.status !== 200) {
    if (response.status === 404) {
      return undefined; // File not found
    }
    throw Error(`Fetching list of files from GitHub failed with ${response.status}: ${response.statusText}`);
  }

  const content: GithubContentResponse = await response.json();
  return content.entries;
}
```

Now we can iterate over the list of files and use the file's `name` property of each file item to fetch its Markdown content using the `fetchMarkdownFile` function that we implemented earlier. We then parse the frontmatter of each file to get all the metadata we need to display a table of contents! 💯

## Render content based on a slug

// TBD
