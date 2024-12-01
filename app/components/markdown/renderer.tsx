import React from 'react';
import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';
import type { HTMLAttributes } from 'react';

type MarkdownContainerProps = HTMLAttributes<HTMLDivElement> & {
  content: RenderableTreeNode;
  components?: {} | undefined; // Type from Markdoc.renderers.react
};

export function MarkdownContainer({ content, components = {}, ...props }: MarkdownContainerProps) {
  const reactNode = Markdoc.renderers.react(content, React, { components });
  return <div {...props}>{reactNode}</div>;
}
