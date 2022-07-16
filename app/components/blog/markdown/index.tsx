import type { FC, HTMLAttributes } from 'react';
import { Decoder, CustomParagraph } from '~/components/UI/markdown';

const H1: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h1 {...props} className="text-3xl lg:text-4xl xl:text-6xl text-secondary dark:text-primary font-extrabold">
      {children}
    </h1>
  );
};

const H2: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h2 {...props} className="text-2xl lg:text-3xl xl:text-4xl text-secondary dark:text-primary font-bold mt-4 lg:mt-8">
      {children}
    </h2>
  );
};

const H3: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h3 {...props} className="text-xl lg:text-2xl xl:text-3xl font-semibold text-secondary dark:text-primary">
      {children}
    </h3>
  );
};

const H4: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h3 {...props} className="text-lg lg:text-xl xl:text-2xl font-normal text-secondary dark:text-primary">
      {children}
    </h3>
  );
};

const OrderedList: FC<HTMLAttributes<HTMLOListElement>> = ({ children }) => {
  return <ol className="list-inside list-decimal">{children}</ol>;
};

const UnorderedList: FC<HTMLAttributes<HTMLUListElement>> = ({ children }) => {
  return <ul className="list-disc list-inside">{children}</ul>;
};

const ListItem: FC<HTMLAttributes<HTMLLIElement>> = ({ children }) => {
  return <li className="pl-4 lg:mb-1 w-full text-lg lg:text-xl xl:text-2xl font-light">{children}</li>;
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

export { H1, H2, H3, H4, P, OrderedList, UnorderedList, ListItem, Code };
