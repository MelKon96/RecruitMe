import { createContext } from 'react';
import type { IUser } from '../types/user';

interface ResumeContextValue {
  resume: IUser | null;
  saveResume: (resume: IUser) => void;
  removeResume: () => void;
}

export const ResumeContext = createContext<ResumeContextValue | null>(null);
