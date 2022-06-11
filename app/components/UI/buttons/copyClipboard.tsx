import type { ButtonHTMLAttributes } from 'react';
import React, { useCallback, useState } from 'react';
import { IconButton } from './index';
import { Tooltip } from '~/components/UI/tooltip';
import { CopyClipboardSvg } from '~/components/UI/icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  title: string;
  className?: string;
  content: string;
}

const CopyClipboardButton: React.FC<ButtonProps> = ({ id, title, content, className = '', ...props }) => {
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
};

export { CopyClipboardButton };
