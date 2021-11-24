import type { FC } from 'react';
import Link from '~/components/link/link';

interface ProjectProps {
  title: string;
  description: string;
  link: string;
}

const Project: FC<ProjectProps> = ({ title, description, link }) => (
  <div className="flex flex-col gap-1 lg:gap-2">
    <h3 className="text-xl xl:text-2xl font-semibold">{title}</h3>
    <div>
      <Link to={link} external>
        Visit Project
      </Link>
    </div>
    <p className="leading-relaxed max-w-2xl">{description}</p>
  </div>
);

export default Project;
