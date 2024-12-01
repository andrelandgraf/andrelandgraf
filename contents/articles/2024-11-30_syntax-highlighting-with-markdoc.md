---
date: 2024-11-30
title: Syntax highlighting with Markdoc and Shiki in Remix
description: Markdown is a great tool for working with formatted text content, including code blocks. In this blog post, we set up Shiki for syntax highlighting with Markdoc and Remix.
categories: [Markdown, Markdoc]
---

Markdown is a great tool for formatted text content, including code blocks. However, Markdown doesn't provide syntax highlighting by default. In a [previous blog post](/2024-11-01_rendering-markdown-in-remix), we set up Markdoc to render Markdown content in a Remix application. In this blog post, we will add syntax highlighting using Shiki.

## What is Shiki?

[Shiki](https://shiki.style/), Japanese word for Style, is a popular syntax highlighter. It is based on the grammar and themes from TextMate, the same engine used by VS Code. Shiki many popular themes and languages and has a modular API for switching out themes at runtime.

### Shiki vs. Prism

Prism is another popular syntax highlighter that is often used with React. One major difference between Shiki and Prism is how both solutions load the required CSS. Prism requires you to import the CSS file for the theme you want to use. Usually, you copy one of the existing CSS files from the [Prism theme repository](https://github.com/PrismJS/prism-themes) to apply the theme to all rendered code blocks. However, Shiki provides a way to load themes lazily at runtime. This can be useful when you want to switch themes based on user preferences, but you also create a similar experience with Prism by dynamically importing the CSS file for the selected theme.

When using Prism client-side, either via packages like `react-prism` or directly, the syntax highlighting is applied during rendering. This can lead to performance issues for large code blocks. Note that this is not an issue with Prism itself, but rather how it is used in React. Both Prism and Shiki can be used to generate the HTML for code blocks server-side.

I personally picked Shiki after using Prims for many years. The documentation is great and the API is easy to use!

## Integrating Shiki with Markdoc

[Markdoc](https://markdoc.dev/) is an all-in-one solution for parsing Markdown. It provides a React renderer that can be used to render Markdown content in React apps. To set up Markdoc in Remix, follow the steps in the previous blog post: [Use Markdoc to render Markdown content in Remix](/2024-11-01_rendering-markdown-in-remix).

### Mapping custom React components

When parsing Markdown content, Markdoc converts it to an abstract syntax tree (AST). Here, each Markdown element is represented by a node. We can then transform the AST and map nodes to custom React components. Code blocks are represented by the `fence` node. [The Markdoc docs](https://markdoc.dev/docs/examples#syntax-highlighting) already provide an example of mapping a custom React component to the `fence` node using `prismjs` for syntax highlighting:

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

In the code example, a custom React `Fence` component is mapped to the `fence` node. The `Fence` component renders the code block with syntax highlighting using `Prism`. A per the [Markdoc docs built-in nodes section](https://markdoc.dev/docs/nodes#built-in-nodes), the `fence` node is supplied with the following attributes (among others):

- `content`: A string containing the plain text content of the code block.
- `language`: A string containing the language identifier for the code block.

Note that the documented example applies the transformation from code block content to HTML using `Prism` during rendering. This is probably fine for most cases, but can be optimized by generating the code block HTML server-side before rendering the React component.

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

Note that we expect all three props to be present. We shouldn't call `CodeBlock` with undefined `content`, `language`, or `innerHtml` as this would lead to a broken code block. However, Markdoc's React renderer component mapping doesn't provide type information about what attributes are available on the node. Hence, there is a chance that the `CodeBlock` component is called without the required props. One way to mitigate this is to provide default values for the props or by using assertions to throw useful runtime errors. Below, we add custom assertions (via `tiny-invariant`) to ensure that the required props are present:

```tsx
import invariant from 'tiny-invariant';

export function CodeBlock({ content, language, innerHtml }: CodeBlockProps) {
  invariant(content, 'CodeBlock must have content');
  invariant(language, 'CodeBlock must have language');
  invariant(innerHtml, 'CodeBlock must have innerHtml');
  // ...
}
```

This is helpful for debugging and ensures that the component is used correctly. It's easy to forget to specify the language for every code block in the Markdown content, so it's good to have a safety net in place.

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

This code example builds on top of the Markdoc setup from my [previous blog post](/2024-11-01_rendering-markdown-in-remix). In a Remix route modules, we define a `loader` function that parses the Markdown content and transforms the AST. We map the `fence` node to our custom `CodeBlock` component, and render the Markdown content using the Markdoc React renderer.

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
const code = `const message = 'Hello, world!';`;
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'vitesse-dark',
});
```

Notice that `codeToHtml` is an async function. This is because Shiki lazily loads the required language grammars and themes, as well as engine dependencies. Markdoc currently has experimental support for async transforms (see [GitHub Issue](https://github.com/markdoc/markdoc/discussions/90) and [release notes](https://github.com/markdoc/markdoc/releases/tag/0.1.4)). However, the implementation is still marked as experimental and not documented.

Instead, we can use Shiki's synchronous API to generate the syntax-highlighted HTML content. This is a bit more involved than its async default API, but it gets the job done! Shiki's synchronous API is documented here: [https://shiki.style/guide/sync-usage](https://shiki.style/guide/sync-usage).

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

Note that we use `invariant` from the `tiny-invariant` package to assert that the required props are present and have the expected values. This is especially useful when working with custom components and attributes in Markdoc where we don't have type information about the node attributes at compile time.

We can now import all themes we want to support (e.g., `dracula-soft`) and languages (e.g., `javascript`) from Shiki. The `codeToHtml` function generates the syntax-highlighted HTML content for a code block using the Shiki instance.

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