import { useId } from 'react';
import { CopyClipboardButton } from '~/components/buttons/copyClipboard.tsx';

type CodeBlockProps = {
  language: string;
  content: string;
  innerHtml: string;
};

export function CodeBlock({ content, language, innerHtml }: CodeBlockProps) {
  const clipboardButtonId = useId();
  return (
    <div className="p-2 lg:p-4 rounded-md font-normal text-sm md:text-base w-full bg-[#282A36] text-white">
      <div className="flex justify-end">
        <span className="mr-5 text-sm md:text-lg">{language}</span>
        <CopyClipboardButton title="Copy code" content={content} id={clipboardButtonId} />
      </div>
      <pre className="overflow-scroll p-2 lg:p-4" dangerouslySetInnerHTML={{ __html: innerHtml }}></pre>
    </div>
  );
}
