import type { IUser, DevLevel } from '../types/user';


interface IRawDummyUser {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phone: string;
  company?: {
    title?: string;
    department?: string;
    name?: string;
  };
}


const POSSIBLE_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Node.js',
  'Java',
  'Spring Boot',
  'Next.js',
  'Redux',
  'Maven',
];

const POSSIBLE_LEVELS: DevLevel[] = ['Junior', 'Middle', 'Senior', 'Lead'];

const getRandomSkills = (id: number): string[] => {
  const count = (id % 3) + 2;
  const skills: string[] = [];
  for (let i = 0; i < count; i++) {
    const index = (id + i * 3) % POSSIBLE_SKILLS.length;
    const skill = POSSIBLE_SKILLS[index];
    if (!skills.includes(skill)) {
      skills.push(skill);
    }
  }
  return skills;
};

const getDevLevel = (id: number): DevLevel => {
  return POSSIBLE_LEVELS[id % POSSIBLE_LEVELS.length];
};

export const adaptUser = (rawUser: IRawDummyUser): IUser => {
  return {
    id: rawUser.id,
    firstName: rawUser.firstName,
    lastName: rawUser.lastName,
    image: rawUser.image,
    email: rawUser.email,
    phone: rawUser.phone,
    company: {
      title: rawUser.company?.title ?? 'Software Engineer',
      department: rawUser.company?.department ?? 'Engineering',
      name: rawUser.company?.name ?? 'Tech Corp',
    },
    skills: getRandomSkills(rawUser.id),
    level: getDevLevel(rawUser.id),
    bio: `Frontend & Fullstack developer. Passionate about clean code, robust architectures, and great UI/UX.`,
  };
};
