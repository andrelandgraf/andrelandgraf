import type { FC, HTMLAttributes } from 'react';

type PageHeadingProps = HTMLAttributes<HTMLHeadingElement>;

const PageHeading: FC<PageHeadingProps> = ({ children, className = '', ...props }) => (
  <h1 {...props} className={`text-4xl xl:text-6xl font-semibold ${className}`}>
    {children}
  </h1>
);

type SectionHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  icon: JSX.Element;
};

const SectionHeading: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h2 {...props} className={`text-xl xl:text-2xl 2xl:text-4xl font-semibold ${className}`}>
    {children}
  </h2>
);

const SectionHeadingWithIcon: FC<SectionHeadingProps> = ({ children, icon, className = '', ...props }) => (
  <div className={`flex items-center gap-5 text-xl xl:text-2xl 2xl:text-4xl font-semibold ${className}`}>
    {icon}
    <SectionHeading {...props}>{children}</SectionHeading>
  </div>
);

export { PageHeading, SectionHeading, SectionHeadingWithIcon };
