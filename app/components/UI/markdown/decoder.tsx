import type { FC, HTMLAttributes } from 'react';
import { Children } from 'react';

const twitterEmbedCode = 'twitterEmbed: ';
const statementCode = 'statement: ';
const decoderCodes = [twitterEmbedCode, statementCode];

/**
 * Decoder parses the children of a code element
 * and decodes custom commands into custom components.
 */
const Decoder: FC<HTMLAttributes<HTMLElement>> = ({ children, ...props }) => {
  const childrenArray = Children.toArray(children);
  const child = childrenArray[0];
  if (child && typeof child == 'string' && child.startsWith(twitterEmbedCode)) {
    const twitterUrl = child.replace(twitterEmbedCode, '');
    return (
      <blockquote className="twitter-tweet">
        <a href={twitterUrl}></a>
      </blockquote>
    );
  } else if (child && typeof child == 'string' && child.startsWith(statementCode)) {
    const statement = child.replace(statementCode, '');
    return (
      <p className="flex items-center gap-4 p-4 rounded-md border border-primary">
        <span className="text-primary text-4xl font-bold">🎯</span>
        {statement}
      </p>
    );
  }

  return <code {...props}>{children}</code>;
};

export { decoderCodes, Decoder };
