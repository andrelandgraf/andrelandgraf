import type { HTMLAttributes } from 'react';
import { Children } from 'react';

const twitterEmbedCode = 'twitterEmbed: ';
const statementCode = 'statement: ';
const quoteCode = 'quote: ';
const citeCode = 'cite: ';
export const decoderCodes = [twitterEmbedCode, statementCode, quoteCode];

/**
 * Decoder parses the children of a code element
 * and decodes custom commands into custom components.
 */
export function Decoder({ children, className = '', ...props }: HTMLAttributes<HTMLElement>) {
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
  } else if (child && typeof child == 'string' && child.startsWith(quoteCode)) {
    const content = child.replace(quoteCode, '');
    const parts = content.split(citeCode);
    if (parts.length !== 2) {
      throw Error('wrong usage of quote code');
    }
    const quote = parts[0].trim();
    const cite = parts[1].trim();
    return (
      <blockquote className="w-full flex flex-col justify-center gap-2">
        <span className="flex items-center gap-2">
          <span className="text-primary text-3xl font-bold">&quot;</span>
          {quote}
          <span className="text-primary text-3xl font-bold">&quot;</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-3xl font-bold">&minus;</span>
          {cite}
        </span>
      </blockquote>
    );
  }

  return <code className={className}>{children}</code>;
}
