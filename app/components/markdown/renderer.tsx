import React from 'react';
import type { RenderableTreeNode } from '@markdoc/markdoc';
import Markdoc from '@markdoc/markdoc';
import type { HTMLAttributes } from 'react';
export * from '../codeBlock.tsx';

type MarkdownContainerProps = HTMLAttributes<HTMLDivElement> & {
  content: RenderableTreeNode;
  components?: Record<string, React.ComponentType>;
};

export function MarkdownContainer({ content, components = {}, ...props }: MarkdownContainerProps) {
  const reactNode = Markdoc.renderers.react(content, React, { components });
  return <div {...props}>{reactNode}</div>;
}
