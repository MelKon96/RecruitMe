// Здесь можно вывести union из константы DEV_LEVELS (as const), чтобы уровни не расходились со схемой и формой.
export type DevLevel = 'Junior' | 'Middle' | 'Senior' | 'Lead';

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

// Здесь можно удалить IFilterParams: тип нигде не используется. Либо подключить его к поиску на UsersPage (search, skills, level).
export interface IFilterParams {
  search: string;
  skills: string[];
  level: DevLevel | '';
}
