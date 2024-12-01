import type { Config } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';
import invariant from 'tiny-invariant';
import { HighlighterCore } from 'shiki';
import { initShiki, codeToHtml } from './shiki.server';

let shikiInstance: HighlighterCore | null = null;

export async function getMarkdocConfig(): Promise<Config> {
  if (!shikiInstance) {
    shikiInstance = await initShiki();
  }
  return {
    nodes: {
      document: {
        render: 'Container',
        attributes: {
          frontmatter: { type: Object, required: true },
        },
      },
      heading: {
        render: 'Heading',
        attributes: {
          id: { type: String },
          level: { type: Number, required: true, default: 1 },
        },
      },
      paragraph: {
        render: 'Paragraph',
      },
      code: {
        render: 'InlineCode',
        attributes: {
          content: { type: String, required: true },
        },
      },
      list: {
        render: 'List',
      },
      item: {
        render: 'ListItem',
      },
      fence: {
        attributes: {
          language: { type: String, required: true },
          content: { type: String, required: true },
        },
        render: 'CodeBlock',
        transform(node) {
          const { content, language } = node.attributes;
          invariant(content && typeof content === 'string', 'Fence node must have content');
          invariant(language && typeof language === 'string', 'Fence node must have language');
          invariant(shikiInstance, 'Shiki instance must be initialized');
          const html = codeToHtml(content, language, { shikiInstance });
          return new Markdoc.Tag('CodeBlock', { ...node.attributes, innerHtml: html });
        },
      },
      link: {
        render: 'Link',
        attributes: {
          href: { type: String, required: true },
          title: { type: String },
        },
      },
      table: {
        render: 'Table',
      },
      th: {
        render: 'TH',
      },
      td: {
        render: 'TD',
        attributes: {
          color: {
            type: String,
            matches: ['green', 'red', 'default'],
            default: 'default',
          },
        },
      },
    },
    tags: {
      tweet: {
        render: 'TweetEmbed',
        attributes: {
          url: { type: String, required: true },
        },
      },
      statement: {
        render: 'Statement',
      },
      quote: {
        render: 'Quote',
        attributes: {
          author: { type: String, required: true },
        },
        transform(node, config) {
          const attributes = node.transformAttributes(config);
          let children = node.transformChildren(config);
          if (children.length && children[0] instanceof Markdoc.Tag && children[0].name === 'Paragraph') {
            children = children[0]?.children;
          }
          return new Markdoc.Tag('Quote', attributes, children);
        },
      },
    },
  };
}
