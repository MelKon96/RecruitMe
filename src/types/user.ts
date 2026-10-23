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
}

// Параметры фильтрации для поиска
export interface IFilterParams {
  search: string;
  skills: string[];
  level: DevLevel | '';
}
