import { useEffect, useState } from 'react';

export type TooltipProps = {
  className?: string;
  text: string;
  width: string;
  elementId: string;
  children?: React.ReactNode;
};

export function Tooltip({ text, elementId, className = '', children }: TooltipProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const element = document.getElementById(elementId);
    const onMouseEnter = () => setShow(true);
    const onMouseLeave = () => setShow(false);
    if (element) {
      element.addEventListener('mouseenter', onMouseEnter);
      element.addEventListener('mouseleave', () => setShow(false));
    }
    return () => {
      document.removeEventListener('mouseenter', onMouseEnter, false);
      document.removeEventListener('mouseleave', onMouseLeave, false);
    };
  }, [elementId]);

  if (!show) {
    return null;
  }

  return (
    <div className={`absolute transform -translate-y-2 bottom-full ${className}`}>
      <div className='bg-black flex relative shadow-xl text-xs rounded-md py-1'>
        <span className={`text-white text-xs font-semibold py-1 px-2 block w-full whitespace-nowrap`}>{text}</span>
        <svg
          className={`absolute text-gray-900 dark:text-gray-100 transform translate-x-full h-2 top-full shadow-xl`}
          x='0px'
          y='0px'
          viewBox='0 0 255 255'
          xmlSpace='preserve'
        >
          <polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
        </svg>
      </div>
      {children}
    </div>
  );
}
