import type { DevLevel } from '../constants/devLevels';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phone: string;
  company: {
    title: string;
    department: string;
    name: string;
  };
  skills: string[];
  level: DevLevel;
  bio: string;
  location?: string;
}

