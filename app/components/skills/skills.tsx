import type { FC } from 'react';

interface SkillsProps {
  skills: string[];
}

const Skills: FC<SkillsProps> = ({ skills }) => (
  <ul className="flex flex-col gap-5">
    {skills.map((skill) => (
      <li className="text-xl xl:text-2xl font-semibold" key={skill}>
        {skill}
      </li>
    ))}
  </ul>
);

export default Skills;
