import type { IUser, DevLevel } from '../types/user';

// Здесь можно вынести один тип сырого ответа dummyjson: IRawDummyUser совпадает с IRawUser в api/usersApi.ts.
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


// Здесь можно не дублировать стек, а брать навыки из constants/technologies.ts.
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

// Здесь можно завести общую константу DEV_LEVELS и из неё вывести DevLevel, zod-enum и опции селекта в ResumeForm.
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
    // Здесь можно не подставлять один и тот же bio всем пользователям: собирать текст из должности и уровня или оставлять пустым, если в API его нет.
    bio: `Frontend & Fullstack developer. Passionate about clean code, robust architectures, and great UI/UX.`,
  };
};
