import type { HTMLAttributes } from 'react';

type PageHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  asH2?: boolean;
};

export function PageHeading({ children, asH2 = false, className = '', ...props }: PageHeadingProps) {
  return asH2
    ? (
      <h2 {...props} className={`text-xl md:text-2xl xl:text-4xl 2xl:text-5xl font-semibold ${className}`}>
        {children}
      </h2>
    )
    : (
      <h1 {...props} className={`text-xl md:text-2xl xl:text-4xl 2xl:text-5xl font-semibold ${className}`}>
        {children}
      </h1>
    );
}

export function SectionHeading({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 {...props} className={`text-lg md:text-xl xl:text-2xl font-semibold ${className}`}>
      {children}
    </h2>
  );
}

type SectionHeadingWithIconProps = HTMLAttributes<HTMLHeadingElement> & {
  icon: JSX.Element;
};

export function SectionHeadingWithIcon({ children, icon, className = '', ...props }: SectionHeadingWithIconProps) {
  return (
    <div className={`flex items-center gap-5 text-lg md:text-xl xl:text-2xl font-semibold ${className}`}>
      {icon}
      <SectionHeading {...props}>{children}</SectionHeading>
    </div>
  );
}
