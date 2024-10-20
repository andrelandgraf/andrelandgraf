import { Highlight } from 'prism-react-renderer';
import { type HTMLAttributes, useId } from 'react';
import { CopyClipboardButton } from '~/components/buttons/copyClipboard.tsx';

type CodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  language?: string;
  content?: string;
};

export function CodeBlock({ content = '', language = 'text' }: CodeBlockProps) {
  const id = useId();
  return (
    <Highlight code={content} language={language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <div className="p-2 lg:p-4 rounded-md font-normal text-sm md:text-base w-full bg-[#2b2b2b] text-white">
          <div className="flex justify-end">
            <span className="mr-5 text-sm md:text-lg">{language}</span>
            <CopyClipboardButton title="Copy code" content={content} id={id} />
          </div>
          <pre className="overflow-scroll p-2 lg:p-4">
            <code>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })} key={i}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} key={key} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </Highlight>
  );
}
