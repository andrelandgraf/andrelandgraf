import type { RenderableTreeNode } from '@markdoc/markdoc';

export type ActionResult<State, ResponseBody> = [status: number, state: State, resData: ResponseBody | undefined];

export type MarkdocFile<FrontMatter> = {
  slug: string;
  content: RenderableTreeNode;
  markdown: string;
  frontmatter: FrontMatter;
};
