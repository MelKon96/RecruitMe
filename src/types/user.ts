import type { DevLevel } from '../constants';
import type { IRawUser } from './rawUser';

export interface IUser extends Omit<IRawUser, 'company'> {
  company: Required<NonNullable<IRawUser['company']>>;
  skills: string[];
  level: DevLevel;
  bio: string;
  location?: string;
}
