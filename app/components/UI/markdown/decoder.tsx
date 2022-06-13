import type { FC, HTMLAttributes } from 'react';
import { Children } from 'react';

const twitterEmbedCode = 'twitterEmbed: ';
const decoderCodes = [twitterEmbedCode];

/**
 * Decoder parses the children of a code element
 * and decodes custom commands into custom components.
 */
const Decoder: FC<HTMLAttributes<HTMLElement>> = ({ children, ...props }) => {
  const childrenArray = Children.toArray(children);
  const child = childrenArray[0];
  if (child && typeof child == 'string' && child.startsWith(twitterEmbedCode)) {
    const twitterUrl = child.replace(twitterEmbedCode, '');
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return (
      <blockquote className="twitter-tweet">
        <a href={twitterUrl}></a>
      </blockquote>
    );
  }

  return <code {...props}>{children}</code>;
};

export { decoderCodes, Decoder };
