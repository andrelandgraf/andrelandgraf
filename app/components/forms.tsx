import clsx from 'clsx';
import { type InputHTMLAttributes, useEffect, useState } from 'react';

import { getFocusClasses } from '~/utilities/ariaClasses';

type TextAreaProps = InputHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  id: string;
};

export function Textarea({ label, id, ...props }: TextAreaProps) {
  const [value, setValue] = useState('');
  const [rows, setRows] = useState(3);

  useEffect(() => {
    const textLength = value.length;
    const rows = Math.ceil(textLength / 80);
    setRows(Math.min(Math.max(rows, 3), 10));
  }, [value]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <textarea
        {...props}
        id={id}
        rows={rows}
        onChange={(event) => setValue(event.target.value)}
        maxLength={400}
        className={clsx(
          getFocusClasses(true),
          'p-4 rounded-md bg-teal-100 dark:bg-teal-900 text-gray-800 dark:text-white',
        )}
      />
    </div>
  );
}
