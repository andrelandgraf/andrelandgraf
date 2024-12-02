---
date: 2024-11-30
title: Syntax highlighting with Markdoc and Shiki in Remix
description: Markdown is a great tool for working with formatted text content, including code blocks. In this blog post, we set up Shiki for syntax highlighting with Markdoc and Remix.
categories: [Remix.run, Markdown]
---

Markdown is a great tool for formatted text content, including code blocks. However, Markdown doesn't provide syntax highlighting by default. In a [previous blog post](/blog/2024-11-01_rendering-markdown-in-remix), we set up Markdoc to render Markdown content in a Remix application. In this blog post, we will add syntax highlighting using Shiki.

## What is Shiki?

[Shiki](https://shiki.style/), Japanese word for Style, is a popular syntax highlighter. It is based on the grammar and themes from TextMate, the same engine used by VS Code. Shiki offers many popular themes and supports all popular programming languages. Syntax highlighting with Shiki is as easy as calling a function with the code content and theme and language identifiers:

```javascript
import { codeToHtml } from 'shiki';

const code = "const message = 'Hello, world!';";
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'vitesse-dark',
});
```

### Shiki vs. Prism

Prism is another popular syntax highlighter that is often used with React. I have used `react-prism` for a while for this blog. When using Prism client-side, either via packages like `react-prism` or directly, the syntax highlighting is applied during rendering. This can lead to performance issues for large code blocks. Note that this is not an issue with Prism itself, but rather how it is used in React. Both Prism and Shiki can be used to generate the HTML for code blocks server-side.

One major difference between Shiki and Prism is how both solutions load the required CSS. Prism provides a [theme repository](https://github.com/PrismJS/prism-themes) and works by exposing classes for tokens in the code block that different themes can style. When using Prism, you must load the theme CSS in your application. On the other hand, Shiki utilizes inline styling and lazily loads the required theme and language grammar. This makes dynamic theming easier. For instance, you can switch themes based on user preferences just by swapping the theme identifier.

Shiki has great documentation, offers both synchronous and asynchronous APIs (as we will see in this blog post), and is easy to set up. Shiki is a great choice for server-side syntax highlighting in a Remix application. That said, both Prism and Shiki are great tools for syntax highlighting!

## Integrating Shiki with Markdoc

[Markdoc](https://markdoc.dev/) is an all-in-one solution for parsing Markdown. If you haven't set up Markdoc yet, follow the steps in the previous blog post: [Use Markdoc to render Markdown content in Remix](/blog/2024-11-01_rendering-markdown-in-remix). 

### Mapping custom React components

When parsing Markdown content, Markdoc converts it to an abstract syntax tree (AST). Here, each Markdown element is represented by a node. We can then transform the AST and map nodes to custom tags which can then be rendered as React components. Code blocks are represented by the `fence` node. [The Markdoc docs](https://markdoc.dev/docs/examples#syntax-highlighting) already provide an example of mapping a custom React component to the `fence` node using Prism for syntax highlighting:

```jsx
import 'prismjs';
import 'prismjs/themes/prism.css';

import Prism from 'react-prism';

export function Fence({ children, language }) {
  return (
    <Prism key={language} component="pre" className={`language-${language}`}>
      {children}
    </Prism>
  );
}

const fence = {
  render: 'Fence',
  attributes: {
    language: {
      type: String
    }
  }
};

const content = Markdoc.transform(ast, {
  nodes: {
    fence
  }
});

Markdoc.renderers.react(content, React, {
  components: {
    Fence
  }
});
```

In the code example, a custom React `Fence` component is mapped to the `fence` node. The `Fence` component renders the code block with syntax highlighting using `Prism`. The `fence` node is supplied with the following attributes (among others):

- `content`: A string containing the plain text content of the code block.
- `language`: A string containing the language identifier for the code block.

Find more information in the Markdoc docs: [https://markdoc.dev/docs/nodes#built-in-nodes](https://markdoc.dev/docs/nodes#built-in-nodes).

Note that the code example uses Prism to parse the code content string to HTML during rendering. This is probably fine for most cases, but can be optimized by generating the code block HTML server-side before rendering the React component. Next, we will do just that in a Remix route module!

### Create a custom CodeBlock component

Let's create a custom `CodeBlock` React component that expects the following props:

- `content`: The plain text content of the code block.
- `language`: The language identifier for the code block.
- `innerHtml`: The HTML content of the code block with syntax highlighting.

The `content` and `language` props are forwarded from the `fence` node attributes ([see docs](https://markdoc.dev/docs/nodes#built-in-nodes)). The `content` prop can be useful for copy-to-clipboard functionality, while the `language` string can be used to display the language name above the code block. Finally, we expect an `innerHtml` prop that contains the HTML content of the code block with syntax highlighting:


```tsx
type CodeBlockProps = {
  language: string;
  content: string;
  innerHtml: string;
};

export function CodeBlock({ content, language, innerHtml }: CodeBlockProps) {
  return (
    <div className="p-2 lg:p-4 rounded-md font-normal text-sm md:text-base w-full bg-[#2b2b2b] text-white">
      <div className="flex justify-end">
        <span className="mr-5 text-sm md:text-lg">{language}</span>
      </div>
      <pre className="overflow-scroll p-2 lg:p-4" dangerouslySetInnerHTML={{ __html: innerHtml }}></pre>
    </div>
  );
}
```

The CodeBlock component is agnostic to the syntax highlighting library and has access to the code content string, the code language, and the syntax-highlighted text content. Adding a copy-to-clipboard button or other custom functionality is easy with this setup!

### Mapping the custom CodeBlock component

Next, we need to map the custom `CodeBlock` component to Markdoc's `fence` node:

```tsx
import React, { useMemo } from 'react';
import Markdoc from '@markdoc/markdoc';
import { useLoaderData } from '@remix-run/react';

// Our custom CodeBlock component
import { CodeBlock } from '~/components/code-block.tsx';

export async function loader() {
  // Example Markdown content
  const doc = `
# Syntax Highlighting

\`\`\`javascript
console.log('Hello, world!');
\`\`\`
`;
  const ast = Markdoc.parse(doc);
  const content = Markdoc.transform(ast, {
    nodes: {
      fence: {
        attributes: {
          language: { type: String, required: true },
          content: { type: String, required: true },
        },
        render: 'CodeBlock', // Tell Markdoc to transform fence nodes to CodeBlock tags
      },
    },
  });

  return { content };
}

export default function Component() {
  const { content } = useLoaderData<typeof loader>();
  const reactNode = useMemo(
    () =>
      // Render the Markdown content using the Markdoc React renderer, providing our custom CodeBlock component with matching name
      Markdoc.renderers.react(content, React, {
        components: {
          CodeBlock,
        },
      }),
    [content],
  );
  return <div className="md-container">{reactNode}</div>;
}
```

This code example builds on top of the Markdoc setup from my [previous blog post](/blog/2024-11-01_rendering-markdown-in-remix). In a Remix route modules, we define a `loader` function that parses the Markdown content and transforms the AST. We map the `fence` node to our custom `CodeBlock` component, and render the Markdown content using the Markdoc React renderer.

This code example doesn't yet include syntax highlighting. The `CodeBlock` component does not yet receive the `innerHtml` prop and will instead render an empty code block. Earlier, we outlined that we want to generate the syntax-highlighted HTML server-side before rendering the React component. For this, we can provide Markdoc `transform` with a custom `transform` function for the `fence` node to inject the `innerHtml` prop:

```tsx
export async function loader() {
  const doc = `
# Syntax Highlighting

\`\`\`javascript
console.log('Hello, world!');
\`\`\`
`;
  const ast = Markdoc.parse(doc);
  const content = Markdoc.transform(ast, {
    nodes: {
      fence: {
        attributes: {
          language: { type: String, required: true },
          content: { type: String, required: true },
        },
        render: 'CodeBlock',
        // Custom transform function for the fence node to supply the innerHtml prop
        transform(node, config) {
          const { content, language } = node.attributes;
          const html = ''; // TODO generate syntax-highlighted HTML content
          // When transforming a fence node, we now provide the innerHtml prop
          return new Markdoc.Tag('CodeBlock', { ...node.attributes, innerHtml: html });
        },
      },
    },
  });

  return { content };
}
```

The updated code now includes a custom `transform` function for the `fence` node. The function receives the `content` and `language` attributes from the `fence` node and should generate the syntax-highlighted HTML content. We will implement this in the next section.

### Setting up Shiki

To use Shiki for syntax highlighting, we need to first install the `shiki` package:

```bash
npm install shiki
```

Here is an easy example of how to use Shiki to generate syntax-highlighted HTML content for a code block:

```javascript
const code = "const message = 'Hello, world!';";
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'vitesse-dark',
});
```

Notice that `codeToHtml` is an async function. This is because Shiki lazily loads the required language grammars and themes, as well as engine dependencies. Markdoc currently has experimental support for async transforms (see [GitHub Issue](https://github.com/markdoc/markdoc/discussions/90) and [release notes](https://github.com/markdoc/markdoc/releases/tag/0.1.4)). However, the implementation is still marked as experimental and not documented.

Instead, we can use Shiki's synchronous API to generate the syntax-highlighted HTML content. This is a bit more involved than the async default API, but it gets the job done! Shiki's synchronous API is documented here: [https://shiki.style/guide/sync-usage](https://shiki.style/guide/sync-usage).

Let's create a `shiki.server.ts` module to export a function to initialize Shiki (async) and a function to generate syntax-highlighted HTML content (sync):

```typescript
import { createHighlighterCoreSync, type HighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import invariant from 'tiny-invariant';

// Import the required themes and languages
import dracula from 'shiki/themes/dracula-soft.mjs';
import js from 'shiki/langs/javascript.mjs';

// Document the supported themes and languages for runtime assertions
const supportedThemes = ['dracula-soft'];
const supportedLanguages = ['javascript', 'txt']; // txt works out of the box

function isSupportedTheme(theme: string) {
  return supportedThemes.includes(theme);
}

function isSupportedLanguage(language: string) {
  return supportedLanguages.includes(language);
}

// Initialize Shiki with the required themes and languages
export async function initShiki(): Promise<HighlighterCore> {
  const engine = await createOnigurumaEngine(import('shiki/wasm'));
  const shiki = createHighlighterCoreSync({
    themes: [dracula],
    langs: [js],
    engine,
  });
  return shiki;
}

type CodeToHtmlCtx = {
  theme?: string;
  shikiInstance: HighlighterCore;
};

// Generate syntax-highlighted HTML content for a code block
export function codeToHtml(content: string, language: string, ctx: CodeToHtmlCtx) {
  const theme = ctx.theme ?? 'dracula-soft';
  invariant(content, 'CodeBlock must have content');
  invariant(isSupportedTheme(theme), `CodeBlock must have a supported theme but got ${theme}`);
  invariant(isSupportedLanguage(language), `CodeBlock must have a supported language but got ${language}`);
  return ctx.shikiInstance.codeToHtml(content, { lang: language, theme });
}
```

We import (preload) all themes we want to support (e.g., `dracula-soft`) and languages (e.g., `javascript`) from Shiki and provide it to the Shiki instance. The `codeToHtml` function generates the syntax-highlighted HTML content for a code block using an existing Shiki instance. This is how we avoid async calls during the highlighting process.

Note that we use `invariant` from the `tiny-invariant` package to assert that the required props are present and match our supported preloaded themes and languages. This is nice to avoid using unsupported languages by mistake.

### Using Shiki in Markdoc transforms

Now we can load a Shiki instance in the `loader` function and use it to generate the syntax-highlighted HTML content for code blocks:

```tsx
import React, { useMemo } from 'react';
import Markdoc from '@markdoc/markdoc';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

// Our Shiki module
import { initShiki, codeToHtml } from '~/modules/blog/shiki.server';
// Our custom CodeBlock component
import { CodeBlock } from '~/components/code-block.tsx';

export async function loader() {
  const doc = `
# Syntax Highlighting

\`\`\`javascript
console.log('Hello, world!');
\`\`\`
`;
  // Initialize Shiki (async)
  const shikiInstance = await initShiki();

  const ast = Markdoc.parse(doc);
  const content = Markdoc.transform(ast, {
    nodes: {
      fence: {
        attributes: {
          language: { type: String, required: true },
          content: { type: String, required: true },
        },
        render: 'CodeBlock',
        // Custom transform function for the fence node to supply the innerHtml prop
        transform(node, config) {
          const { content, language } = node.attributes;
          // Generate syntax-highlighted HTML content (sync)
          const html = codeToHtml(content, language, { shikiInstance });
          // When transforming a fence node, we now provide the innerHtml prop
          return new Markdoc.Tag('CodeBlock', { ...node.attributes, innerHtml: html });
        },
      },
    },
  });

  return { content };
}

export default function Component() {
  const { content } = useLoaderData<typeof loader>();
  const reactNode = useMemo(
    () =>
      Markdoc.renderers.react(content, React, {
        components: {
          CodeBlock,
        },
      }),
    [content],
  );
  return <div className="md-container">{reactNode}</div>;
}
```

Success! We have now set up Shiki for syntax highlighting with Markdoc in a Remix application. The `loader` function initializes Shiki and generates the syntax-highlighted HTML content for code blocks using the Shiki instance. The `CodeBlock` component receives the `innerHtml` prop and renders the code block with syntax highlighting.

## Conclusion

In this blog post, we set up Shiki for syntax highlighting with Markdoc in a Remix application. We created a custom `CodeBlock` component to render code blocks with syntax highlighting. We used Shiki's synchronous API and Markdoc's custom transforms to generate the syntax-highlighted HTML content server-side. Finally, we mapped the custom `CodeBlock` component to the `fence` node in Markdoc to render Markdown content with syntax highlighting.

Happy coding!