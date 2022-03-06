import type { FC, HTMLAttributes } from 'react';

const H1: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h2 {...props} className="text-xl xl:text-2xl font-extrabold">
      {children}
    </h2>
  );
};

const H2: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h3 {...props} className="text-lg xl:text-xl font-bold">
      {children}
    </h3>
  );
};

const H3: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => {
  return (
    <h3 {...props} className="text-base xl:text-lg font-semibold">
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
  return <li className="pl-4 lg:mb-1 w-full lg:text-lg">{children}</li>;
};

export { H1, H2, H3, OrderedList, UnorderedList, ListItem };
