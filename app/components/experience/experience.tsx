import type { FC } from 'react';

interface ExperienceProps {
  title: string;
  description: string;
  fromTo: string;
  location: string;
  company: string;
}

const Experience: FC<ExperienceProps> = ({ title, description, fromTo, location, company }) => (
  <div className="w-full flex flex-col-reverse lg:flex-row gap-1 lg:gap-0">
    <div className="flex flex-col gap-1 lg:gap-2">
      <h3 className="text-xl xl:text-2xl font-semibold">{title}</h3>
      <h4 className="font-semibold">{company}</h4>
      <p className="leading-relaxed max-w-2xl">{description}</p>
    </div>
    <p className="flex flex-col gap-1 font-light lg:gap-2 lg:ml-auto lg:text-right lg:items-end">
      <span>{fromTo}</span>
      <i>{location}</i>
    </p>
  </div>
);

export default Experience;
