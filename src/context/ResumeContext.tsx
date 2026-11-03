import { createContext } from 'react';
import type { IUser } from '../types/user';

interface ResumeContextValue {
  resumes: IUser[];
  activeResumeId: number | null;
  activeResume: IUser | null;
  saveResume: (resume: IUser) => void;
  removeResume: (id: number) => void;
  setActiveResume: (id: number) => void;
}

export const ResumeContext = createContext<ResumeContextValue | null>(null);
