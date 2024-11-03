---
date: 2022-05-29
title: How to integrate Markdown content with syntax highlighting in Remix.run
description: Markdown is a powerful tool for writing and publishing content. There are different ways of integrating Markdown into your Remix application. In this blog post, I want to show you how my own Markdown setup works.
categories: [Remix.run]
---

Markdown is amazing. It's a powerful tool for writing and publishing content. In fact, the text you are reading right
now is stored in a Markdown file. There are different ways of integrating Markdown into your Remix application, and not
all of them are straightforward. In this blog post, I want to show you how my own Markdown setup works. Let's start by
going over different options of integrating Markdown in Remix.

## Off-the-shelf solution

[Remix Stacks](https://remix.run/docs/en/v1/pages/stacks) can be used to generate Remix projects quickly and easily
based on official and community-created templates. One of those templates is the
[Speed Metal Stack](https://github.com/Girish21/speed-metal-stack) by [Girish](https://twitter.com/girishk21). It's a
blog starter template that includes a lot of useful features for writing and publishing content. If you are looking for
an out-of-the-box solution, then this is the stack for you!

## MDX route modules

The easiest way of integrating Markdown into Remix is probably to use
[MDX route modules](https://remix.run/docs/en/v1/guides/mdx) directly in the `app/routes` directory. Remix will compile
those files for you, and you can even add frontmatter for meta and headers properties - more about frontmatter later.

MDX files can be put directly in `app/routes` to act as route modules:

```markdown
---
meta:
  title: Remix Markdown Setup with Syntax Highlighting
  description: Markdown is amazing.
headers:
  Cache-Control: no-cache
---

# A route module using MDX
```

So why don't we just stop here? MDX route modules are a great starting point but they aren't as flexible as other
options. MDX is convenient to work with but personally, I like to separate content from code. Instead of importing React
components into my content (MDX), I'd rather render my Markdown inside components. It's also worth mentioning that if
you want to maintain hundreds of Markdown files, then you will likely run into
[scalability issues](https://remix.run/docs/en/v1/guides/mdx#:~:text=Clearly%20this%20is,MDX%20Bundler.) when using MDX
route modules.

In case you would like to work with MDX but want more flexibility than MDX route modules, have a look at
[MDX Bundler](https://github.com/kentcdodds/mdx-bundler). If you are interested in pursuing this route (pun intended),
check out [Kiliman's](https://twitter.com/kiliman) implementation [on GitHub](https://github.com/kiliman/kiliman-dev).
However, we will be working with Markdown files instead of MDX in this blog post.

## Reading Markdown files from fs

A custom setup that separates data and display allows for more flexibility than MDX route modules. We can read our
Markdown content from the filesystem, parse the frontmatter, and then render the Markdown content inside our
application.

**Note:** Most serverless environments, such as Vercel or Netlify, don't have access to the filesystem. This means that
you can't use this setup in those environments.

Let's create a folder for our Markdown content, e.g. `contents/articles`. Inside the folder, we create one Markdown file
for each of our articles. In a Node.js-based environment, we can read a file using `fs.readFile`.

**Note:** If you are using Deno, you can use `Deno.readTextFile` instead of `fs.readFile`. Find more information in the
[deno documentation](https://deno.land/manual/examples/read_write_files).

Let's create a file reading utility, e.g. `readPost.server.ts`:

```typescript
import fs from 'fs/promises';

export async function readPost(fileName: string) {
  const file = await fs.readFile(`./contents/articles/${fileName}`);
  return file.toString();
}
```

**Note:** Make sure to put the utility function in a file ending with `.server` to exclude the Node.js lib imports from
the client bundle.

We call `readPost` in our route's loader function to access the Markdown string on the server:

```tsx
import { readPost } from '~/utilities/readPost.server.ts';

export async function loader() {
  const markdown = await readPost('remix-markdown-setup.md');
  return { markdown };
}

export default function ArticleComponent() {
  const { markdown } = useLoaderData();
  // TODO transform markdown to HTML (we come to this later)
}
```

Great! Now we can access the Markdown string in our React components using the `useLoaderData` hook from Remix!

### Loading Markdown content dynamically using slugs

In the previous example, we hardcoded the filename of the Markdown file. Let's change that to use slugs. A slug is a
URL-friendly string. It's used to identify a specific article or blog post.

Let's create a route module named `/blog/$slug` with a `slug` parameter and use the `slug` parameter to access a
Markdown file dynamically based on the user's request:

```tsx
import { readPost } from '~/utilities/readPost.server.ts';

export async function loader({ params }) {
  const { slug } = params;
  const markdown = await readPost(`${slug}.md`);
  if (!markdown) {
    throw new Response('Not Found', { status: 404 });
  }
  return { markdown };
}

export default function ArticleComponent() {
  const { markdown } = useLoaderData();
  // TODO transform markdown to HTML (we come to this later)
}
```

Sweet! Now we dynamically find our Markdown file based on the user's request! 🥳

There are still some downsides to this approach. Firstly, we don't always have access to the filesystem. Some edge and
serverless environments do not allow access to the underlying filesystem. Additionally, if the content lives on our
server's filesystem, then an update to the content requires a new deployment of the application to update the server's
filesystem. This is inconvinient. We want to be able to save our content changes and see our changes right away, right?
Well, we can do so if we decouple the content from the server.

## Fetching Markdown files from a remote origin

We can fetch Markdown files from a remote server. This approach also works for serverless environments and eases
updating content. By using a remote origin, the content can be updated without the need to redeploy.

### Fetching Markdown files from GitHub

It's still convinient to co-locate Markdown content and our code. We can get the best of both worlds by using GitHub. We
can manage our content using git, but we are also able to fetch the content using the GitHub API.

I am using this approach on my own blog (thanks for reading btw.) and it works great! More precisely, I am reading from
the filesystem on localhost and fetching the files from GitHub on production. This way, I am able to review new blog
posts locally but can also make changes to the content without triggering a redeploy!

So let's see how we can fetch Markdown content from GitHub. In the following, we will use the GitHub API directly.

Let's fetch the content of one file from GitHub:

```typescript
export async function fetchMarkdownFile(fileName: string) {
  const accessToken = '<your-github-access-token>';
  const accountName = '<your-github-account-name>';
  const repoName = '<your-github-repo-name>';
  const headers = new Headers();
  headers.set('Accept', 'application/vnd.github.v3.raw');
  headers.set('Authorization', `token ${accessToken}`);
  headers.set('User-Agent', '<your-app-name>');

  const repo = `https://api.github.com/repos/${accountName}/${repoName}`;
  const dir = '/contents/articles/';
  const url = new URL(repo + dir + fileName);

  const response = await fetch(url, { headers });
  if (!response.ok || response.status !== 200) {
    if (response.status === 404) {
      return undefined; // File not found
    }
    throw Error(`Fetching Markdown file from GitHub failed with ${response.status}: ${response.statusText}`);
  }
  return response.text();
}
```

**Note:** If you think this is too cumbersome, then you are definetly not alone!
[Jacob Ebey](https://twitter.com/ebey_jacob) created an awesome abstraction layer on top of the GitHub API, which let's
you fetch Markdown from GitHub in no time. Please check out the [github-md](https://github.com/jacob-ebey/github-md) API
to save some code.

Either way, using github-md or our custom fetch logic, we are now able to fetch Markdown content from GitHub!

Now we can update our code from earlier and fetch the content from GitHub:

```tsx
import { fetchMarkdownFile } from '~/utilities/github.server.ts';

export async function loader({ params }) {
  const { slug } = params;
  const markdown = await fetchMarkdownFile(`${slug}.md`);
  if (!markdown) {
    throw new Response('Not Found', { status: 404 });
  }
  return { markdown };
}

export default function ArticleComponent() {
  const { markdown } = useLoaderData();
  // TODO transform markdown to HTML (almost there!)
}
```

Awesome! We are able to fetch Markdown files from a remote origin and load them into our React components! 🎉 So how do
we transform the Markdown string into HTML?

{% tweet url="https://twitter.com/tannerlinsley/status/1527752952768696320" /%}

Parsing Markdown is not straightforward. Even the pros of the industry sometimes struggle with it. It's quite a rabbit
hole.

## How to parse frontmatter

Let's first discuss how we parse the frontmatter off the Markdown file. Frontmatter is a great way to store metadata in
a Markdown file. Frontmatter is added to a Markdown file using the following convention:

```markdown
---
title: Remix Markdown Setup with Syntax Highlighting
description: Markdown is amazing.
---

# Frontmatter

On top of a Markdown file add `---` to start and `---` to end of your frontmatter content. Each frontmatter attribute is
a key-value pair.
```

Parsing frontmatter off a Markdown file is as easy as installing the front-matter package:

```bash
npm i front-matter
```

Then we can just call the `parseFrontMatter` function:

```tsx
import { parseFrontMatter } from 'front-matter';
import { fetchMarkdownFile } from '~/utilities/github.server.ts';

export async function loader({ params }) {
  const { slug } = params;
  const markdown = await fetchMarkdownFile(`${slug}.md`);
  if (!markdown) {
    throw new Response('Not Found', { status: 404 });
  }
  // "attributes" contains the parsed frontmatter
  // "body" contains the Markdown string without the frontmatter
  const { attributes, body } = parseFrontMatter(markdown);
  return { attributes, body };
}

export default function ArticleComponent() {
  const { attributes, body } = useLoaderData();
  // TODO transform Markdown to HTML (I swear, next section!)
  return (
    <article>
      <h1>{attributes.title}</h1>
    </article>
  );
}
```

## Transforming Markdown to HTML

Now it gets a bit tricky but bear with me!

The easiest way to transform Markdown to HTML in React is using
[react-markdown](https://github.com/remarkjs/react-markdown). Unfortunately, react-markdown switched
[to only support ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) and Remix currently runs as
a CommonJS module. Using an older version of react-markdown is not an option as they only support async rendering. We
want to make sure to render the HTML content right on the server without the need to use `useEffect` or multiple
renders.

Luckily, Remix introduced
[a workaround to integrate ESM packages](https://remix.run/docs/en/v1/pages/gotchas#importing-esm-packages) in its
CommonJS environment.

Let's first install react-markdown:

```bash
npm i react-markdown
```

Now we have to alter the `remix.config.js` file as specified in the
[remix.run documentation](https://remix.run/docs/en/v1/pages/gotchas#importing-esm-packages) and add all ESM packages
that we want to use (that is `react-markdown` and all its dependencies):

```javascript
/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  // ...
  serverDependenciesToBundle: [
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    /^unist.*/,
    /^hast.*/,
    /^bail.*/,
    /^trough.*/,
    /^mdast.*/,
    /^micromark.*/,
    /^decode.*/,
    /^character.*/,
    /^property.*/,
    /^space.*/,
    /^comma.*/,
    /^react-markdown$/,
    /^vfile.*/,
  ],
};
```

Shout-out to [Girish](https://twitter.com/girishk21) for helping me with this workaround!

We can now go ahead and utilize the `ReactMarkdown` component exposed by the react-markdown package:

```tsx
import { parseFrontMatter } from 'front-matter';
import ReactMarkdown from 'react-markdown';
import { fetchMarkdownFile } from '~/utilities/github.server.ts';

export async function loader({ params }) {
  const { slug } = params;
  const markdown = await fetchMarkdownFile(`${slug}.md`);
  if (!markdown) {
    throw new Response('Not Found', { status: 404 });
  }
  const { attributes, body } = parseFrontMatter(markdown);
  return { attributes, body };
}

export default function ArticleComponent() {
  const { attributes, body } = useLoaderData();
  return (
    <article>
      <h1>{attributes.title}</h1>
      <ReactMarkdown>{body}</ReactMarkdown>
    </article>
  );
}
```

We are now rendering Markdown content in a synchronized manner in our Remix app with frontmatter support and our fancy
remote fetching logic! 🔥

If you have issues with the ESM workaround and receive `Error [ERR_REQUIRE_ESM]: require() of ES Module` errors, try
deleting the `.cache` folder in your project root:

```bash
rm -rf .cache public/build node_modules package-lock.json
```

**Note:** Run `rm -rf` at your own risk!

**Note:** If your issues persist, you can also go ahead and reimplement react-markdown yourself. That's what I did
before the ESM workaround was introduced by the Remix team. You can find my old source code for the CommonJS version of
react-markdown [here](https://gist.github.com/andrelandgraf/895d6251d9d3c8160251d86cd3c10d50).

## How to use custom React components with Markdown

Mapping Markdown HTML elements to custom React components is a great way to extend the functionality of your Markdown
and to reuse your app's styling and behavior!

Some cool things you can do with custom React components:

- A custom video player
- A custom link component that handles external links differently
- An optimized image component
- Syntax highlighting for code and pre blocks
- Custom codes that map to custom components to insert advertisements, marketing banners, etc.

react-markdown (using `rehype-react` under the hood) comes with a `components` property that allows us to map HTML
elements to custom React components. Import the components you want to use and pass them to the `components` property:

```tsx
import ReactMarkdown from 'react-markdown';
import { H1, StyledLink } from '~/components/UI';

export default function ArticleComponent() {
  const { attributes, body } = useLoaderData();
  return (
    <article>
      <h1>{attributes.title}</h1>
      <ReactMarkdown
        components={{
          h1({ node, children, ...props }) {
            return <H1 {...props}>{children}</H1>;
          },
          a({ node, children, ...props }) {
            return <StyledLink {...props}>{children}</StyledLink>;
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </article>
  );
}
```

**Note:** The `components` property is a JavaScript object that maps HTML elements to custom React components. The keys
of the object are the HTML element names and the values are the custom React components. The mapping also gives us
access to a `node` property that contains the parsed HTML element (type `Element`).

## Adding syntax highlighting to Markdown code blocks

Let's take a look at how we can add syntax highlighting to our Markdown code content.

```javascript
console.log('Do you like the syntax highlighting?');
```

We introduce another package here: prism-react-renderer:

```bash
npm i prism-react-renderer
```

Next, we create a wrapper component around the primitives provided by prism-react-renderer. With prism-react-renderer
syntax highlighing aka. styling our code block becomes as easy as copy-pasting one of the CSS themes from the
[prism-react-renderer repository](https://github.com/themarcba/prism-themes/tree/master/themes).

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
  if (!children) throw Error('CodeBlock: children is required');
  const childrenArray = Children.toArray(children);
  const codeElement = childrenArray[0] as ReactElement;
  const className = codeElement?.props?.className || '';
  const code = codeElement.props.children[0] || '';
  const lang = getLanguageFromClassName(className);
  if (!isLanguageSupported(lang)) throw Error(`CodeBlock: language ${lang} is not supported`);
  return (
    <Highlight {...defaultProps} code={code.trim()} language={lang || 'bash'}>
      {({ className, tokens, getLineProps, getTokenProps }) => (
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
      )}
    </Highlight>
  );
};
```

Since we have full control over the markup of our code block component, we can add custom features such as
copy-to-clipboard buttons, headers, and custom styling! You can find my own implementation with Tailwind CSS
[here](https://github.com/andrelandgraf/andrelandgraf/blob/64f2a0b77ea944e6337ac060000407509ec11d8f/app/components/UI/markdown/pre.tsx#L50).

**Note:** Make sure to add `overflow: scroll` to the `pre` element's styling to ensure that your code is displayed
nicely.

To change the syntax highlighting, we can select a CSS file from the
[prism-react-renderer repository](https://github.com/themarcba/prism-themes/tree/master/themes). Copy-paste the content
of the theme in a CSS file in your project and
[import it into your Remix application](https://remix.run/docs/en/v1/guides/styling#styling):

```tsx
import stylesUrl from '~/styles/code.css';

export function links {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};
```

Now, we only have to add the `CodeBlock` component to our `components` mapping:

```tsx
import { MarkdownContainer } from '~/components/MarkdownContainer';
import { CodeBlock } from '~/components/UI';

export default function ArticleComponent() {
  const { attributes, body } = useLoaderData();
  return (
    <article>
      <h1>{attributes.title}</h1>
      <MarkdownContainer
        source={body}
        options={{
          components: {
            pre(node, children, ...props) {
              return <CodeBlock {...props}>{children}</CodeBlock>;
            },
          },
        }}
      />
    </article>
  );
}
```

That's it! We successfully implemented a custom pipeline to fetch dynamic Markdown content from a remote origin, parse
its frontmatter, transform the Markdown into HTML, and map it to custom React components! We also added syntax
highlighting through a custom code block component and a CSS theme with prism-react-renderer. 💯

Wow, that's a lot of work! And there is so much more to explore! We are now able to fetch one dynamic Markdown file from
GitHub but what about fetching multiple Markdown files from GitHub? I will not go into more code examples here but touch
onto some more topics in the following. I will also try to add more blog posts about more advanced topics in the future,
so make sure to follow me [on Twitter](https://twitter.com/AndreLandgraf94)!

Thanks for reading! Have a great one! 👋

## How to fetch multiple Markdown Files

Usually, you want to display a list of all your content to users as well. GitHub offers
[an API endpoint](https://docs.github.com/en/rest/repos/contents#if-the-content-is-a-directory) to get all files within
a directory. From there, we can fetch each file content and parse the frontmatter. This should give us all the
information required to render a list of contents.

**Note:** Alternatively, [github-md](https://github.com/jacob-ebey/github-md) also provides an API endpoint to get all
files of a directory.

## Caching responses from GitHub

[GitHub throttles](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) the number of
requests you can make to their API. To avoid this, we can cache the responses from GitHub. Both github-md and the GitHub
API return the SHA of the commit where each file was changed. We can use the SHA identifier to cache the response.
That's a great starting point for creating a custom caching layer using something like Redis.

## Generating a Table of Contents from a Markdown file

So far, I have not found a nice way to create a dynamic table of contents based on the content of a Markdown file. In
[Particular.Cloud](https://particular.cloud/documentation/developers/v1), I dynamically parse through the final HTML (in
a `useEffect`), but I don't think that's a very elegant solution. I hope I can update this section soon!

Please let me know [on Twitter](https://twitter.com/AndreLandgraf94) if you have any suggestions!

## Alternative solutions

It took me a long time to create a nice Markdown logic on
[Particular.Cloud](https://particular.cloud/documentation/developers/v1) and on my personal website. I am pretty happy
with the current implementation, but I am still looking into ways to improve it over time (especially the table of
contents). I will try to keep this blog post up to date!

There are a lot of alternative solutions out there and I want to make sure to list some of them in the following.

### Kent's custom Markdown setup

It wouldn't be a blog post about Remix.run without referencing Kent C. Dodds. Kent has created a very sophisticated
Markdown pipeline for his website. Check out
[the kentcdodds.com repository](https://github.com/kentcdodds/kentcdodds.com) on GitHub.

### Ben Wishovich's Markdown setup using Rust

Ben loves Rust and created a server-side Markdown processing pipeline using Rust. You can find a nice presentation about
the benchmarking and motivation [on YouTube](https://www.youtube.com/watch?v=ApiK8EPvW38), a detailed blog post
[on his personal site](https://benw.is/posts/compiling-markdown), and his npm package
[on npm](https://www.npmjs.com/package/@benwis/femark).
