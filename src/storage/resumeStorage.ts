import type { IUser } from '../types/user';

const RESUME_STORAGE_KEY = 'recruit_me_resume';
const RESUME_UPDATED_EVENT = 'resume-updated';

export const getResume = (): IUser | null => {
  try {
    const savedResume = localStorage.getItem(RESUME_STORAGE_KEY);
    return savedResume ? (JSON.parse(savedResume) as IUser) : null;
  } catch {
    return null;
  }
};

export const saveResume = (resume: IUser): void => {
  localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
  window.dispatchEvent(new Event(RESUME_UPDATED_EVENT));
};

export const removeResume = (): void => {
  localStorage.removeItem(RESUME_STORAGE_KEY);
  window.dispatchEvent(new Event(RESUME_UPDATED_EVENT));
};
