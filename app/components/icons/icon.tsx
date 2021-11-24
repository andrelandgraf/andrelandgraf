import React, { PropsWithChildren } from 'react';

interface IconProps {
  title: string;
  className?: string;
}

const Icon: React.FC<PropsWithChildren<IconProps>> = ({ title, children, className = '' }) => (
  <div className={className}>
    <p className="sr-only">{title}</p>
    {children}
  </div>
);

export default Icon;
