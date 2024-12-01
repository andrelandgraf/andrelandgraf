---
date: 2024-11-01
title: Use Markdoc to render Markdown content in Remix
description: Markdown is a great tool for working with formatted text content. In this blog post, we use Markdoc to parse and render Markdown content in Remix. We will cover styling, frontmatter, and how to render Markdown content as custom React components.
categories: [Remix.run, Markdown, Markdoc]
---

Markdown is a great tool for working with formatted text content and is commonly used for blog posts and documentation. In fact, the text you are reading right now is written in Markdown. There are different ways of working with Markdown content in Remix. I am currently using Markdoc and think it's great. In this blog post, we will set up Markdoc with Remix and cover the initial setup, styling, frontmatter, and how to render Markdown content as custom React components.

## What is Markdoc?

[Markdoc](https://markdoc.dev/) is an all-in-one solution for parsing Markdown, converting it to an abstract syntax tree (AST), transforming it using variables, tags, and functions, and then rendering it to HTML or React. First developed by Stripe for its documentation, it is now open source and quite popular ([GitHub repo](https://github.com/markdoc/markdoc)).

### Markdoc vs. unified

The unified ecosystem is widely popular for Markdown processing, offering packages for converting Markdown to AST, handling frontmatter, and rendering HTML or React. I’ve worked with unified before but ran into issues back in the early Remix days, especially with CJS/ESM compatibility ([here’s an old Gist on that](https://gist.github.com/andrelandgraf/895d6251d9d3c8160251d86cd3c10d50)). Markdoc has streamlined documentation, all in one place, making it easier to follow without jumping between README files for [rehype](https://www.npmjs.com/package/rehype), [remark](https://www.npmjs.com/package/remark), [unified](https://www.npmjs.com/package/unified), and others. That said, [react-markdown](https://www.npmjs.com/package/react-markdown) is also a solid choice for getting started.

## Setting up Markdoc

First, install the latest version of Markdoc in your Remix project:

```bash
npm i @markdoc/markdoc@latest
```

Next, create [a route module](https://remix.run/docs/en/2.13.1/file-conventions/routes), for instance `routes/_index.tsx`, and export a `loader` function to run server-side code:

```tsx
import Markdoc from '@markdoc/markdoc';

export function loader() {
  const doc = `
# Hello World!

Markdoc experiment on {% $date %}.
`;

  const ast = Markdoc.parse(doc);
  console.log('Intermediary step: abstract syntax tree', JSON.stringify(ast, null, 2));
  const content = Markdoc.transform(ast, { variables: { date: new Date().toDateString() } });
  console.log('Transformed Markdown content, including resolved variables, etc.', JSON.stringify(content, null, 2));
  const html = Markdoc.renderers.html(content);
  console.log('Generated HTML content', html);
  return { html };
}
```

Just like that, we’ve parsed Markdown content into static HTML. First, we call `Markdoc.parse` to convert the Markdown string into an abstract syntax tree (AST). We then transform the AST using `Markdoc.transform`, which allows us to resolve variables, tags, and functions. Finally, we render the transformed content to HTML using `Markdoc.renderers.html`. By handling everything server-side, we gain access to the filesystem for reading Markdown files and/or can securely fetch content from remote sources like GitHub or databases. We can also cache the rendered HTML for better performance using tools like [cachified](https://github.com/epicweb-dev/cachified) or HTTP caching.

Next, we can access the returned loader data in the route component and render it:

```tsx
import Markdoc from '@markdoc/markdoc';
import { useLoaderData } from '@remix-run/react';

export function loader() {
  const doc = `
# Hello World!

Markdoc experiment on {% $date %}.
`;

  const ast = Markdoc.parse(doc);
  const content = Markdoc.transform(ast, { variables: { date: new Date().toDateString() } });
  const html = Markdoc.renderers.html(content);
  return { html };
}

export default function Component() {
  const { html } = useLoaderData<typeof loader>();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

We use the `dangerouslySetInnerHTML` prop to render the HTML content. This is safe because we control the content and ensure it’s sanitized. With this approach, we server-side render our page with the Markdown content, which is great for SEO and performance.

### Styling

The simplest way to style Markdown content is to target each HTML tag within the Markdown container. For example, we can create a `markdown.css` file, import it in our Remix route module, and apply a class to the wrapping `div` containing our Markdown content that includes styles for headings, paragraphs, and other elements:

`app/styles/markdown.scss`:

```css
.md-container {
  h1 {
    font-weight: bold;
    font-size: 20px;
  }

  p {
    font-size: 16px;
    line-height: 1.5;
    color: #bbbbbb;
  }
}
```

`app/routes/_index.tsx`:

```tsx
import Markdoc from '@markdoc/markdoc';
import { useLoaderData } from '@remix-run/react';

import '~/styles/markdown.css';

export function loader() {
  const doc = `
# Hello World!

Markdoc experiment on {% $date %}.
`;

  const ast = Markdoc.parse(doc);
  const content = Markdoc.transform(ast, { variables: { date: new Date().toDateString() } });
  const html = Markdoc.renderers.html(content);
  return { html };
}

export default function Component() {
  const { html } = useLoaderData<typeof loader>();
  return <div className="md-container" dangerouslySetInnerHTML={{ __html: html }} />;
}
```

This approach alone gets us really far. We can now style the headings, paragraphs, links, tables, and other [supported Markdoc nodes](https://markdoc.dev/docs/syntax#nodes). For more extensibility, we will later switch to rendering the content with React, allowing us to map custom React components to Markdoc nodes and tags.

### Using frontmatter

Frontmatter is a common way to add page-level metadata to a Markdown document. Though it’s not part of the Markdown spec, Markdoc supports extracting frontmatter out of the box ([see docs](https://markdoc.dev/docs/frontmatter)). Markdoc supports frontmatter in different formats like YAML and JSON. We can access the parsed frontmatter directly from the AST object. When formatting the frontmatter as JSON, we simply need to call `JSON.parse` to turn it into a JavaScript object. To ensure all required attributes are present, we can use [zod](https://www.npmjs.com/package/zod) or a simple type check:


```tsx
import Markdoc from '@markdoc/markdoc';
import { useLoaderData } from '@remix-run/react';

import '~/styles/markdown.css';

type BlogPostFrontmatter = {
  title: string;
  description: string;
  categories: string[];
};

function isFrontmatter(attributes: unknown): attributes is BlogPostFrontmatter {
  return (
    !!attributes &&
    typeof attributes === 'object' &&
    'title' in attributes &&
    'description' in attributes &&
    'categories' in attributes
  );
}

export function loader() {
  const doc = `---
{
"title": "Markdown rendering with Markdoc in Remix",
"description": "Markdown is a powerful tool for writing and publishing content. There are different ways of integrating Markdown into your Remix application. In this blog post, we will integrate Markdoc with Remix to render Markdown with custom React components.",
"categories": ["Remix.run", "Markdown"]
}
---

## Introduction

Markdoc experiment on {% $date %}.
`;

  const ast = Markdoc.parse(doc);
  const frontmatterStr = ast.attributes.frontmatter;
  const frontmatter = JSON.parse(frontmatterStr);
  if (!isFrontmatter(frontmatter)) {
    throw new Error('Invalid frontmatter');
  }
  const content = Markdoc.transform(ast, { variables: { date: new Date().toDateString() } });
  const html = Markdoc.renderers.html(content);
  return { html, frontmatter };
}

export default function Component() {
  const { html, frontmatter } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-2xl font-extrabold">{frontmatter.title}</h1>
      <p>
        Categories: <i>{frontmatter.categories.join(', ')}</i>
      </p>
      <div className="md-container" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
```

Note: I personally manage my frontmatter as YAML, instead of JSON, because that seems to be the most widely used format. Instead of `JSON.parse`, I use [js-yaml](https://www.npmjs.com/package/js-yaml) to parse the YAML string into a JavaScript object.

Next, we use Remix's `meta` function to dynamically set the route's title, description, and other meta information based on our frontmatter. Add a `meta` function to the route module and use the `frontmatter` loader data for the page's title, description, and keywords meta tags:

```tsx
// Add new import
import { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.frontmatter) {
    // Default meta tags in case the loader fails
    return [
      { title: 'Blog' },
      { name: 'description', content: 'Blog posts about Remix.run and other web development topics.' },
    ];
  }
  return [
    { title: data.frontmatter.title },
    { name: 'description', content: data.frontmatter.description },
    { name: 'keywords', content: data.frontmatter.categories.join(', ') },
  ];
};
```

Great! Your Markdown content is now styled and includes frontmatter for any metadata, such as meta tags. For a simple blog post, this is already a great setup.

Next, we will render the content to React instead of HTML. We were able to render the HTML on the server and then inject the HTML string into our React app. Now, we have to move the rendering part into our React component. From our `loader` function, we will now return the transformed JSON representation of the content before rendering it to a React Node in our component:

```tsx
// Add new imports
import React, { useMemo } from 'react';

export function loader() {
  const doc = `---
{
"title": "Markdown rendering with Markdoc in Remix",
"description": "Markdown is a powerful tool for writing and publishing content. There are different ways of integrating Markdown into your Remix application. In this blog post, we will integrate Markdoc with Remix to render Markdown with custom React components.",
"categories": ["Remix.run", "Markdown"]
}
---

## Introduction

Markdoc experiment on {% $date %}.
`;

  const ast = Markdoc.parse(doc);
  const frontmatterStr = ast.attributes.frontmatter;
  const frontmatter = JSON.parse(frontmatterStr);
  if (!isFrontmatter(frontmatter)) {
    throw new Error('Invalid frontmatter');
  }
  const content = Markdoc.transform(ast, { variables: { date: new Date().toDateString() } });
  // Remove the HTML rendering and update the return statement
  return { content, frontmatter };
}

export default function Component() {
  const { content, frontmatter } = useLoaderData<typeof loader>();
  // Render the content to React
  const reactNode = useMemo(() => Markdoc.renderers.react(content, React), [content]);
  return (
    <div>
      <h1 className="text-2xl font-extrabold">{frontmatter.title}</h1>
      <p>
        Categories: <i>{frontmatter.categories.join(', ')}</i>
      </p>
      <div className="md-container">{reactNode}</div>
    </div>
  );
}
```

### Mapping custom React components

Markdoc has the concept of nodes and tags. Nodes are Markdown elements such as headings or paragraphs. Tags are a syntactic extension of Markdown, allowing us to define custom elements. Using Markdoc's React renderer, we can map React components to both nodes and tags. For example, we can create a custom `Link` component for rendering all anchor tags (link node) with Remix's `NavLink` component. We can further create a callout tag for highlighted text and map it to a `Callout` component.

First, let's update our example Markdown content to include a new custom tag `{% callout %}` and an anchor tag `[blog](/blog)`. Additionally, we need to expand the configuration object passed to `Markdoc.transform` to instruct Markdoc how to render these elements:

```tsx
export function loader() {
  const doc = `---
{
"title": "Markdown rendering with Markdoc in Remix",
"description": "Markdown is a powerful tool for writing and publishing content. There are different ways of integrating Markdown into your Remix application. In this blog post, we will integrate Markdoc with Remix to render Markdown with custom React components.",
"categories": ["Remix.run", "Markdown"]
}
---

## Introduction

Markdoc experiment on {% $date %}.

{% callout type="info" %} This is an info message. {% /callout %}

Visit my blog at [blog](/blog).
`;

  const ast = Markdoc.parse(doc);
  const frontmatterStr = ast.attributes.frontmatter;
  const frontmatter = JSON.parse(frontmatterStr);
  if (!isFrontmatter(frontmatter)) {
    throw new Error('Invalid frontmatter');
  }
  const content = Markdoc.transform(ast, {
    variables: { date: new Date().toDateString() },
    // Nodes are elements like headings, paragraphs, lists, etc.
    nodes: {
      link: {
        render: 'Link',
        attributes: {
          href: { type: 'String', required: true },
        },
      },
    },
    // Tags are custom elements like callouts, alerts, etc. that we introduce in our Markdown content
    tags: {
      callout: {
        render: 'Callout',
        attributes: {
          type: { type: 'String', required: true, default: 'info' },
        },
      },
    },
  });

  return { content, frontmatter };
}
```

You can refer to the Markdoc documentation for more information on the supported attributes and options for [nodes](https://markdoc.dev/docs/nodes).

Next, we create the `Link` and `Callout` components:

```tsx
// Add new imports
import React, { AnchorHTMLAttributes, useMemo } from 'react';
import { NavLink, useLoaderData } from '@remix-run/react';
// clsx is a utility for conditionally joining class names, it's optional
import clsx from 'clsx';

function Link({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <NavLink className="underline" to={href} prefetch="intent" {...props}>
      {children}
    </NavLink>
  );
}

function Callout({ type, children }: { type: string; children: string }) {
  return (
    <span
      className={clsx('w-full block p-4', {
        'bg-gray-400': type === 'info',
        'bg-lime-200': type === 'warning',
      })}
    >
      {children}
    </span>
  );
}
```

Finally, we pass our components to the `Markdoc.renderers.react` function:

```tsx
export default function Component() {
  const { content, frontmatter } = useLoaderData<typeof loader>();
  const reactNode = useMemo(
    () =>
      Markdoc.renderers.react(content, React, {
        components: {
          Link,
          Callout,
        },
      }),
    [content],
  );
  return (
    <div>
      <h1 className="text-2xl font-extrabold">{frontmatter.title}</h1>
      <p>
        Categories: <i>{frontmatter.categories.join(', ')}</i>
      </p>
      <div className="md-container">{reactNode}</div>
    </div>
  );
}
```

And that's it! We have successfully integrated Markdoc with Remix.

Final code:

```tsx
import React, { AnchorHTMLAttributes, useMemo } from 'react';
import Markdoc from '@markdoc/markdoc';
import { MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import '~/styles/markdown.css';

type BlogPostFrontmatter = {
  title: string;
  description: string;
  categories: string[];
};

function isFrontmatter(attributes: unknown): attributes is BlogPostFrontmatter {
  return (
    !!attributes &&
    typeof attributes === 'object' &&
    'title' in attributes &&
    'description' in attributes &&
    'categories' in attributes
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.frontmatter) {
    // Default meta tags in case the loader fails
    return [
      { title: 'Blog' },
      { name: 'description', content: 'Blog posts about Remix.run and other web development topics.' },
    ];
  }
  return [
    { title: data.frontmatter.title },
    { name: 'description', content: data.frontmatter.description },
    { name: 'keywords', content: data.frontmatter.categories.join(', ') },
  ];
};

export function loader() {
  const doc = `---
{
"title": "Markdown rendering with Markdoc in Remix",
"description": "Markdown is a powerful tool for writing and publishing content. There are different ways of integrating Markdown into your Remix application. In this blog post, we will integrate Markdoc with Remix to render Markdown with custom React components.",
"categories": ["Remix.run", "Markdown"]
}
---

## Introduction

Markdoc experiment on {% $date %}.

{% callout type="info" %} This is an info message. {% /callout %}

Visit my blog at [blog](/blog).
`;

  const ast = Markdoc.parse(doc);
  const frontmatterStr = ast.attributes.frontmatter;
  const frontmatter = JSON.parse(frontmatterStr);
  if (!isFrontmatter(frontmatter)) {
    throw new Error('Invalid frontmatter');
  }
  const content = Markdoc.transform(ast, {
    variables: { date: new Date().toDateString() },
    nodes: {
      link: {
        render: 'Link',
        attributes: {
          href: { type: 'String', required: true },
        },
      },
    },
    tags: {
      callout: {
        render: 'Callout',
        attributes: {
          type: { type: 'String', required: true, default: 'info' },
        },
      },
    },
  });

  return { content, frontmatter };
}

function Link({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <NavLink className="underline" to={href} prefetch="intent" {...props}>
      {children}
    </NavLink>
  );
}

function Callout({ type, children }: { type: string; children: string }) {
  return (
    <span
      className={clsx('w-full block p-4', {
        'bg-gray-400': type === 'info',
        'bg-lime-200': type === 'warning',
      })}
    >
      {children}
    </span>
  );
}

export default function Component() {
  const { content, frontmatter } = useLoaderData<typeof loader>();
  const reactNode = useMemo(
    () =>
      Markdoc.renderers.react(content, React, {
        components: {
          Link,
          Callout,
        },
      }),
    [content],
  );
  return (
    <div>
      <h1 className="text-2xl font-extrabold">{frontmatter.title}</h1>
      <p>
        Categories: <i>{frontmatter.categories.join(', ')}</i>
      </p>
      <div className="md-container">{reactNode}</div>
    </div>
  );
}
```

### Syntax highlighting

Markdown doesn't provide syntax highlighting for code blocks out of the box. However, we can use Prism, Shiki, or other syntax highlighters to add this feature. The Markdoc documentation provides an example for [rendering code blocks with syntax highlighting using Prism](https://markdoc.dev/docs/examples#syntax-highlighting). I personally use Shiki, which is the engine behind VS Code's syntax highlighting. I wrote a separate blog post on integrating Shiki with Markdoc, which you can find [here](/2024-11-30_syntax-highlighting-with-markdoc).

## Conclusion

Markdoc is a powerful tool for parsing and rendering Markdown content. It offers a simple and straightforward way to transform Markdown content into an abstract syntax tree, resolve variables, tags, and functions, and render it to HTML or React. By mapping custom React components to Markdoc nodes and tags, we can extend the functionality of the Markdown content and have the full power of React at our disposal. Remix allows us to split the rendering process between the server and the client, ensuring fast and SEO-friendly content delivery with server-side rendering.

Happy coding!