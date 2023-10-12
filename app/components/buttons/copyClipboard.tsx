import type { ButtonHTMLAttributes } from 'react';
import { useCallback, useState } from 'react';

import { CopyClipboardSvg } from '~/components/icons';
import { Tooltip } from '~/components/tooltips';

import { IconButton } from './index';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  id: string;
  title: string;
  className?: string;
  content: string;
};

export function CopyClipboardButton({ id, title, content, className = '', ...props }: ButtonProps) {
  const [text, setText] = useState('Copy');

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(content);
    setText('Copied!');
    setTimeout(() => {
      setText('Copy');
    }, 1000);
  }, [content]);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Tooltip elementId={id} text={text} width="w-10" />
      <IconButton {...props} onClick={handleClick} title={title} id={id}>
        <CopyClipboardSvg className="mobile:w-5 mobile:h-5" />
      </IconButton>
    </div>
  );
}
