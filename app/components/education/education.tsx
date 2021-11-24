import type { FC } from 'react';

interface EducationProps {
  univeristy: string;
  degree: string;
  major: string;
  fromTo: string;
  location: string;
}

const Education: FC<EducationProps> = ({ univeristy, degree, major, fromTo, location }) => (
  <div className="w-full flex flex-col-reverse lg:flex-row gap-2 lg:gap-0">
    <div className="flex flex-col gap-1 lg:gap-2">
      <h3>{univeristy}</h3>
      <h4 className="flex flex-col gap-1 lg:gap-2">
        <span className="text-xl xl:text-2xl font-semibold">{degree}</span>
        <i className="font-medium">{major}</i>
      </h4>
    </div>
    <p className="flex flex-col gap-1 font-light lg:gap-2 lg:ml-auto lg:text-right lg:items-end">
      <span>{fromTo}</span>
      <i>{location}</i>
    </p>
  </div>
);

export default Education;
