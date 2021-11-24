import type { FC } from 'react';

interface HeaderProps {
  title: string;
  icon: JSX.Element;
}

const Header: FC<HeaderProps> = ({ title, icon }) => (
  <div className="flex items-center gap-5 text-xl xl:text-2xl 2xl:text-4xl font-semibold">
    {icon}
    <h2>{title}</h2>
  </div>
);

export default Header;
