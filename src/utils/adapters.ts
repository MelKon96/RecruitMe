import type { IUser } from '../types/user';
import { DEV_LEVELS, type DevLevel } from '../constants/devLevels';
import type { IRawUser } from '../types/rawUser';
import { technologies } from '../constants/technologies';

const getRandomSkills = (id: number): string[] => {
  const count = (id % 3) + 2;
  const skills: string[] = [];

  for (let i = 0; i < count; i++) {
    const index = (id + i * 3) % technologies.length;
    const skill = technologies[index];

    if (skill && !skills.includes(skill)) {
      skills.push(skill);
    }
  }

  return skills;
};

const getDevLevel = (id: number): DevLevel => {
  return DEV_LEVELS[id % DEV_LEVELS.length];
};

export const adaptUser = (rawUser: IRawUser): IUser => {
  const level = getDevLevel(rawUser.id);
  const title = rawUser.company?.title ?? 'Software Engineer';

  return {
    id: rawUser.id,
    firstName: rawUser.firstName,
    lastName: rawUser.lastName,
    image: rawUser.image,
    email: rawUser.email,
    phone: rawUser.phone,
    company: {
      title,
      department: rawUser.company?.department ?? 'Engineering',
      name: rawUser.company?.name ?? 'Tech Corp',
    },
    skills: getRandomSkills(rawUser.id),
    level,
    bio: `${title} уровня ${level}.`,
  };
};
