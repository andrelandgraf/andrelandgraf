---
date: 2022-05-29
title: Remix Markdown Setup with Syntax Highlighting
description: Markdown is a powerful tool for writing and publishing content. There are different ways of integrating Markdown in your Remix application. In this blog post, I want to show you how my own Markdown setup works.
categories: [Remix.run]
---

Markdown is amazing. It's a powerful tool for writing and publishing content. In fact, the text you are reading right now is stored in a Markdown file. There are different ways of integrating Markdown in your Remix application. Not all of them are straightforward. In this blog post, I want to show you how my own Markdown setup works. Let's start by going over different options of integrating Markdown in Remix.

## MDX route modules

The easiest way of integrating Markdown in Remix is probably to use [MDX route modules](https://remix.run/docs/en/v1/guides/mdx) directly in the `app/routes` directory. Remix will compile those files for you and you can even add frontmatter to them.

MDX files can be put directly in `app/routes` to act as route modules:

```markdown
---
meta:
  title: Remix Markdown Setup with Syntax Highlighting
  description: Markdown is amazing.
headers:
  Cache-Control: no-cache
---

# MDX route modules
```

## Reading Markdown files from fs

A custom setup that separates data and display allows for more flexibility. We can read our Markdown content from the filesystem, parse the frontmatter, and then render the Markdown content inside our application.

Let's create a folder for our Markdown content, e.g. `contents/articles`. Inside the folder, we create one example file, e.g. `remix-markdown-setup.md`. In a Node.js environment, we can read the file using `fs.readFile` in our route's loader function.

Let's create a file reading utility, e.g. `readPost.server.ts`:

```typescript
import fs from 'fs/promises';

export async function readPost(fileName: string) {
  const file = await fs.readFile(`./contents/articles/${fileName}`);
  return file.toString();
}
```

**Note:** Make sure to put the utility function in a file ending with `.server` to exclude the Node.js lib imports from the client bundle (e.g. `readPost.server.ts`).

We call `readPost` in our route's loader function to access the Markdown string on the server:

```tsx
import type { LoaderFunction } from 'remix';
import { readPost } from '~/utilities/readPost.server.ts';

export const loader: LoaderFunction = async () => {
  const markdown = await readPost('remix-markdown-setup.md');
  return { markdown };
};

export default function PostComponent() {
  const { markdown } = useLoaderData();
  // ...
}
```

Great! Now we can access the Markdown string in our route component! Unfortunately, this will only work in a Node.js environment that has access to the filesystem. Unfortunately, most serverless environments - such as Vercel or Netlify - don't have access to the filesystem.

## Fetching Markdown files from a remote origin

Instead, let's fetch Markdown files from a remote server. This approach will work in serverless environments and will also make curating the content easier. If the content lives in the filesystem, then an update to the content requires a new deployment of the application. With a remote origin, the content can be updated without redeploying.

### Fetching from GitHub

It's still convinient to co-locate Markdown content and our code. We can get the best of both worlds by using GitHub. We can manage our content using git but we are also able to fetch the content using the GitHub API.

I am using this approach on my own blog (thanks for reading btw.) and it works great! More precisely, I am reading from the filesystem on localhost and fetch the files from GitHub on production. This way, I am able to review new blog posts locally but can also make changes to the content without triggering a deploy!

Let's fetch the content of one file from GitHub:

```typescript
export async function fetchMarkdownFile(fileName: string) {
  const accessToken = '<your-github-access-token>';
  const headers = new Headers();
  headers.set('Accept', 'application/vnd.github.v3.raw');
  headers.set('Authorization', `token ${accessToken}`);
  headers.set('User-Agent', '<your-app-name>');

  const repo = 'https://api.github.com/repos/andrelandgraf/andrelandgraf';
  const dir = '/contents/articles/';
  const url = new URL(repo + dir + fileName);

  const response = await fetch(url, { headers });
  if (!response.ok || response.status !== 200) {
    if (response.status === 404) {
      return undefined; // File not found
    } else {
      throw Error(`GitHub fetch markdown API request failed with ${response.status}: ${response.statusText}`);
    }
  }
  const textContent = await response.text();
  return textContent;
}
```

Sweet! Now we can update our code from earlier and fetch the content from GitHub.

```tsx
import type { LoaderFunction } from 'remix';
import { fetchMarkdownFile } from '~/utilities/github.server.ts';

export const loader: LoaderFunction = async () => {
  const markdown = await fetchMarkdownFile('remix-markdown-setup.md');
  return { markdown };
};

export default function PostComponent() {
  const { markdown } = useLoaderData();
  // ...
}
```

Awesome! We are now able to read and fetch Markdown strings and load them into our route components using `useLoaderData`. So how do we transform the Markdown string into HTML?

<a href={https://twitter.com/tannerlinsley/status/1527752952768696320}></a>

Parsing Markdown is not straightforward. Even the pros may struggle with it and it's quite a rabbit-hole.

## Parsing Frontmatter

Let's first discuss how we parse the frontmatter off the markdown file. Frontmatter is a way to store metadata in a Markdown file.

```markdown
---
title: Remix Markdown Setup with Syntax Highlighting
description: Markdown is amazing.
---

# Remix Markdown Setup
```

We can do this using the `front-matter` package and one function call:

```tsx
import type { LoaderFunction } from 'remix';
import { parseFrontMatter } from 'front-matter';
import { fetchMarkdownFile } from '~/utilities/github.server.ts';

export const loader: LoaderFunction = async () => {
  const markdown = await fetchMarkdownFile('remix-markdown-setup.md');
  const { attributes, body } = parseFrontMatter(markdown);
  return { attributes, body };
};

export default function PostComponent() {
  const { attributes, body } = useLoaderData();
  return (
    <article>
      <h1>{attributes.title}</h1>
    </article>
  );
}
```

## Transforming Markdown to HTML

Markdown is transformed to HTML through the [unified](https://github.com/unifiedjs/unified) interface. unified provides an abstract interface for parsing syntax trees. First, we use [remark](https://github.com/remarkjs/remark) to parse the Markdown into an abstract representation (using unified), then we use [rehype](https://github.com/rehypejs/rehype) to transform the abstract representation into HTML.

Do we have to do all of this by ourselves? Usually you can use [react-markdown](https://github.com/remarkjs/react-markdown) to abstract away the complexity. However, react-markdown recently switched [to only support ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). Unfortunately, Remix does currently run as a CommonJS module. You can find a workaround to this problem [in the Remix docs](https://remix.run/docs/en/v1/pages/gotchas#importing-esm-packages).

My own solution utilizes older versions of remark and rehype that still support CommonJS. I am not using an older version of react-markdown as those only support async rendering. We want to make sure to render the HTML content right on the server without the need to use `useEffect` or multiple renders. I further use rehype-react to map the HTML to custom React components.

So let's install the following packages in their correct versions:

```bash
npm i rehype-react@^6.2.1 remark-parse@^9.0.0 remark-rehype@^8.1.0 unified@^9.2.2
```

Next, we can create a single hook to parse the Markdown and transform it to HTML:

```tsx
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { Fragment, createElement } from 'react';
import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import type { Options as RehypeReactOptions } from 'rehype-react';
import rehypeReact from 'rehype-react';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type ReyhpeOptions = PartialBy<RehypeReactOptions<typeof createElement>, 'createElement'>;

export const useMarkdown = (source: string, rehypeReactOptions: ReyhpeOptions = {}): ReactElement =>
  useMemo(
    () =>
      unified()
        .use(remarkParse)
        .use(remarkToRehype)
        .use(rehypeReact, {
          createElement,
          Fragment,
          ...rehypeReactOptions,
        } as RehypeReactOptions<typeof createElement>)
        .processSync(source).result as ReactElement,
    [source, rehypeReactOptions],
  );
```

Our `useMarkdown` hook takes the Markdown string and the options for rehype-react as arguments and returns an React element for us to render.

I usually wrap the hook in a custom component that renders the Markdown content:

```tsx
import type { FC, HTMLAttributes } from 'react';
import type { ReyhpeOptions } from '~/hooks';
import { useMarkdown } from '~/hooks';

interface MarkdownContainerProps extends HTMLAttributes<HTMLDivElement> {
  source: string;
  options?: ReyhpeOptions;
}

export const MarkdownContainer: FC<MarkdownContainerProps> = ({ source, options, ...props }) => {
  const html = useMarkdown(source, options);
  return <div {...props}>{html}</div>;
};
```

Now we have all the bits and pieces together to render Markdown content! 🥳

So let's put it all together:

```tsx
import type { LoaderFunction } from 'remix';
import { parseFrontMatter } from 'front-matter';
import { MarkdownContainer } from '~/components/MarkdownContainer';
import { fetchMarkdownFile } from '~/utilities/github.server.ts';

export const loader: LoaderFunction = async () => {
  const markdown = await fetchMarkdownFile('remix-markdown-setup.md');
  const { attributes, body } = parseFrontMatter(markdown);
  return { attributes, body };
};

export default function PostComponent() {
  const { attributes, body } = useLoaderData();
  return (
    <article>
      <h1>{attributes.title}</h1>
      <MarkdownContainer source={body} />
    </article>
  );
}
```

## Using custom React components

rehype-react allows you to select custom React components for each HTML tag. rehype-react will then go ahead a map the HTML to the custom React component.
This is a great way to extend the functionality of your Markdown and to reuse your app's styling and behavior!

Since we already built this functionality into our component and hook, we just need to provide the rehype-react options:

```tsx
import { MarkdownContainer } from '~/components/MarkdownContainer';
import { H1, StyledLink } from '~/components/UI';

export default function PostComponent() {
  const { attributes, body } = useLoaderData();
  return (
    <article>
      <h1>{attributes.title}</h1>
      <MarkdownContainer
        source={body}
        options={{
          components: {
            h1: H1,
            a: StyledLink,
          },
        }}
      />
    </article>
  );
}
```

Just import the components you want to use and pass them to the `components` option. All HTML tags are supported! This is especially useful to add syntax highlighting to code blocks.

## Syntax Highlighting

```javascript
console.log('Do you like the syntax highlighting?');
```

We introduce another package here: prism-react-renderer. We need to create a wrapper component around the primitives provided by prism-react-renderer. Then styling becomes as easy as copy-pasting one of the themes from the [prism-react-renderer repository](https://github.com/themarcba/prism-themes/tree/master/themes).

Our wrapper component:

```tsx
import type { FC, HTMLAttributes, ReactElement } from 'react';
import { Children, useId } from 'react';
import type { Language } from 'prism-react-renderer';
import Highlight, { defaultProps } from 'prism-react-renderer';

function getLanguageFromClassName(className: string) {
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : '';
}

function isLanguageSupported(lang: string): lang is Language {
  return (
    lang === 'markup' ||
    lang === 'bash' ||
    lang === 'clike' ||
    lang === 'c' ||
    lang === 'cpp' ||
    lang === 'css' ||
    lang === 'javascript' ||
    lang === 'jsx' ||
    lang === 'coffeescript' ||
    lang === 'actionscript' ||
    lang === 'css-extr' ||
    lang === 'diff' ||
    lang === 'git' ||
    lang === 'go' ||
    lang === 'graphql' ||
    lang === 'handlebars' ||
    lang === 'json' ||
    lang === 'less' ||
    lang === 'makefile' ||
    lang === 'markdown' ||
    lang === 'objectivec' ||
    lang === 'ocaml' ||
    lang === 'python' ||
    lang === 'reason' ||
    lang === 'sass' ||
    lang === 'scss' ||
    lang === 'sql' ||
    lang === 'stylus' ||
    lang === 'tsx' ||
    lang === 'typescript' ||
    lang === 'wasm' ||
    lang === 'yaml'
  );
}

export const CodeBlock: FC<HTMLAttributes<HTMLPreElement>> = ({ children }) => {
  const id = useId();
  if (!children) throw Error('CodeBlock: children is required');
  const childrenArray = Children.toArray(children);
  const codeElement = childrenArray[0] as ReactElement;
  const className = codeElement?.props?.className || '';
  const code = codeElement.props.children[0] || '';
  const lang = getLanguageFromClassName(className);
  if (!isLanguageSupported(lang)) throw Error(`CodeBlock: language ${lang} is not supported`);
  return (
    <div className="w-full">
      <Highlight {...defaultProps} code={code.trim()} language={lang || 'bash'}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <div className="p-2 lg:p-4 rounded-md font-normal text-sm md:text-base w-full">
            <pre className={`overflow-scroll ${className}`} style={{}}>
              <code className={className} style={{}}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })} style={{}}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} style={{}} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  );
};
```

Since we have full control over the markup of our code block component, we can add custom features such as copy-to-clipboard buttons or custom styling to it! To style the code block, we just have to copy-paste a CSS file from the[prism-react-renderer repository](https://github.com/themarcba/prism-themes/tree/master/themes) and [import it into our Remix route](https://remix.run/docs/en/v1/guides/styling#styling).

Now, we only have to add the `CodeBlock` component to our `components` mapping:

```tsx
import { MarkdownContainer } from '~/components/MarkdownContainer';
import { H1, StyledLink, CodeBlock } from '~/components/UI';

export default function PostComponent() {
  const { attributes, body } = useLoaderData();
  return (
    <article>
      <h1>{attributes.title}</h1>
      <MarkdownContainer
        source={body}
        options={{
          components: {
            h1: H1,
            a: StyledLink,
            pre: CodeBlock,
          },
        }}
      />
    </article>
  );
}
```

That's it! We successfully implemented a custom pipeline to fetch Markdown from a remote origin, parse frontmatter, transform the Markdown into HTML, and map it to custom React components. We added syntax highlighting through a custom code block component and a CSS theme from prism-react-renderer. 💯

## Multiple Markdown Files

Usually, you want to display a list of all blog posts to the user as well. Luckily, this isn't very complicated. GitHub offers another API endpoint to get all files within a directory. From there, we can fetch each file content and parse the frontmatter. This should give us all the information needed to render a list of all blog articles.

I won't go into more details here but you can find my GitHub fetching logic [here](https://github.com/andrelandgraf/andrelandgraf/tree/6c5158770dbebd55d71788194d3ce6ed1004e1c0/app/actions/github). The `fetchFileItems` function fetches an array of all items within a GitHub repository. For each of those items, I then go ahead and fetch the content of the file using the `fetchMarkdownFile` function that we defined earlier.

## Table of Contents

So far, I have not found a nice way to create a dynamic table of content based on the content of a Markdown file. In [Particular.Cloud](https://particular.cloud/documentation/developers/v1), I dynamically parse through the final HTML (in a `useEffect`), but I don't think that's a very elegant solution. I hope I can update this section soon!

Please let me know on Twitter @andrelandgraf94 if you have any suggestions!

## References & Inspirations

It wouldn't be a blog post about Remix.run without referencing Kent C. Dodds website. Kent has created a very sophisticated Markdown pipeline himself. Check out [the kentcdodds.com repository](https://github.com/kentcdodds/kentcdodds.com) on GitHub.

It took me a long time to create a nice Markdown logic in [Particular.Cloud](https://particular.cloud/documentation/developers/v1). I am pretty happy with the current implementation, but I am still looking into way to improve it over time (especially the table of contents). I will update everything I find out about it on this blog post!
