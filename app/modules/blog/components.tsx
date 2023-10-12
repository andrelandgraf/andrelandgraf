import type { FC, HTMLAttributes } from 'react';

import { CustomParagraph, Decoder } from '~/components/markdown';

const H1: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h1 {...props} className="text-3xl lg:text-4xl xl:text-6xl text-secondary dark:text-primary font-extrabold">
      {children}
    </h1>
  );
};

const H2: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h2 {...props} className="text-2xl lg:text-3xl xl:text-4xl text-secondary dark:text-primary font-bold mt-6 lg:mt-8">
      {children}
    </h2>
  );
};

const H3: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h3
      {...props}
      className="text-xl lg:text-2xl xl:text-3xl font-semibold text-secondary dark:text-primary mt-4 lg:mt-6"
    >
      {children}
    </h3>
  );
};

const H4: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h3 {...props} className="text-lg lg:text-xl xl:text-2xl font-normal text-secondary dark:text-primary mt-2 lg:mt-4">
      {children}
    </h3>
  );
};

const OrderedList: FC<HTMLAttributes<HTMLOListElement>> = ({ children, ...props }) => {
  return (
    <ol className="list-inside list-decimal" {...props}>
      {children}
    </ol>
  );
};

const UnorderedList: FC<HTMLAttributes<HTMLUListElement>> = ({ children, ...props }) => {
  return (
    <ul className="list-disc list-inside" {...props}>
      {children}
    </ul>
  );
};

const ListItem: FC<HTMLAttributes<HTMLLIElement>> = ({ children, ...props }) => {
  return (
    <li className="pl-4 lg:mb-1 w-full text-lg lg:text-xl xl:text-2xl font-light" {...props}>
      {children}
    </li>
  );
};

const P: FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => {
  return (
    <CustomParagraph {...props} className="text-lg lg:text-xl xl:text-2xl font-light">
      {children}
    </CustomParagraph>
  );
};

const Code: FC<HTMLAttributes<HTMLElement>> = ({ children, ...props }) => {
  return (
    <Decoder {...props} className="text-base font-mono p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
      {children}
    </Decoder>
  );
};

export { Code, H1, H2, H3, H4, ListItem, OrderedList, P, UnorderedList };
