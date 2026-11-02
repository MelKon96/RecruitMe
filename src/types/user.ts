import type { DevLevel } from "../constants/devLevels";
// import type { IRawUser } from "./rawUser";

// Здесь можно не перечислять id, имя, фото, email и телефон второй раз.
// IUser расширяет IRawUser, а компанию заменяет на обязательную:
// extends Omit<IRawUser, 'company'> {
//   company: Required<NonNullable<IRawUser['company']>>;
//   skills, level, bio и location остаются только здесь.
// Omit убирает необязательную company, NonNullable снимает undefined,
// Required делает title, department и name обязательными строками.
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

// export interface IUser extends Omit<IRawUser, "company"> {
//   company: Required<NonNullable<IRawUser["company"]>>;
//   skills: string[];
//   level: DevLevel;
//   bio: string;
//   location?: string;
// }
