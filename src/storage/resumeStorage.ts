import type { IUser } from '../types/user';

export const RESUME_STORAGE_KEY = 'recruit_me_resume';

export const getResume = (): IUser | null => {
  try {
    const savedResume = localStorage.getItem(RESUME_STORAGE_KEY);
    return savedResume ? (JSON.parse(savedResume) as IUser) : null;
  } catch {
    return null;
  }
};
