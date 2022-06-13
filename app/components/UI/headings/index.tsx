import type { FC, HTMLAttributes } from 'react';

type PageHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  asH2?: boolean;
};

const PageHeading: FC<PageHeadingProps> = ({ children, asH2 = false, className = '', ...props }) =>
  asH2 ? (
    <h2 {...props} className={`text-xl md:text-2xl xl:text-4xl font-semibold ${className}`}>
      {children}
    </h2>
  ) : (
    <h1 {...props} className={`text-xl md:text-2xl xl:text-4xl font-semibold ${className}`}>
      {children}
    </h1>
  );

type SectionHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  icon: JSX.Element;
};

const SectionHeading: FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h2 {...props} className={`text-lg md:text-xl xl:text-2xl font-semibold ${className}`}>
    {children}
  </h2>
);

const SectionHeadingWithIcon: FC<SectionHeadingProps> = ({ children, icon, className = '', ...props }) => (
  <div className={`flex items-center gap-5 text-lg md:text-xl xl:text-2xl font-semibold ${className}`}>
    {icon}
    <SectionHeading {...props}>{children}</SectionHeading>
  </div>
);

export { PageHeading, SectionHeading, SectionHeadingWithIcon };
