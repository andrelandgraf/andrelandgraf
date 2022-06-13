import type { FC, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { useMemo, Children } from 'react';
import { decoderCodes } from './decoder';

function childToText(child: ReactElement): string {
  if (typeof child === 'string') {
    return child;
  }
  if (typeof child === 'object' && child.props) {
    return nodeToText(child.props.children);
  }
  return '';
}

function nodeToText(children: ReactNode): string {
  const childrenArray = Children.toArray(children);
  let text = '';
  for (let i = 0; i < childrenArray.length; i += 1) {
    const child = childrenArray[i];
    text += childToText(child as ReactElement);
  }
  return text;
}

const CustomParagraph: FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => {
  const text = useMemo(() => nodeToText(children), [children]);

  // Codes are wrapped with a paragraph, so we need to remove the paragraph
  if (decoderCodes.find((code) => text.startsWith(code))) {
    return <>{children}</>;
  }

  return <p {...props}>{children}</p>;
};

export { CustomParagraph };
